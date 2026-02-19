export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  successMessage?: string
  successTitle?: string
  errorTitle?: string
  loading?: Ref<boolean>
}

export interface ApiResponse<T = any> {
  error?: boolean
  customErrorMessage?: string
  errorMessage?: string[] | Record<string, string>
  data?: T
}

export function useApiHandler() {
  const toast = useToast()
  const config = useRuntimeConfig()
  const token = useCookie("auth_token")
  const router = useRouter()

  const request = async <T = any>(
    url: string,
    payload: Record<string, any> = {},
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      method = "POST",
      successMessage,
      successTitle = "Success",
      errorTitle = "Error",
      loading
    } = options

    try {
      if (loading) loading.value = true

      const response = await $fetch<ApiResponse<T>>(url, {
        method,
        body: method !== "GET" ? payload : undefined,
        baseURL: config.public.apiBase as string, // optional
        credentials: "include" // optional (auth cookies)
      })

      // API-level error
       if (response?.error) {
        // AUTH FAILURE
        if ((response as any)?.code === "UNAUTHORIZED") {
          token.value = null
          await router.push("/login")
          return Promise.reject("Unauthorized")
        }

        throw new Error(
          response.customErrorMessage ||
            flattenErrors(response.errorMessage) ||
            "Something went wrong"
        )
      }

      // Success toast
      if (successMessage) {
        toast.add({
          title: successTitle,
          description: successMessage,
          color: "success"
        })
      }

      return response

    } catch (err: any) {
      // HTTP 401 error
       if (err?.status === 401) {
        token.value = null
        await router.push("/login")
        return Promise.reject(err)
      }
      
      // Network / server error
      toast.add({
        title: errorTitle,
        description: err?.message || "Something went wrong",
        color: "error"
      })

      throw err

    } finally {
      if (loading) loading.value = false
    }
  }

  // Helpers
  const get = <T = any>(url: string, options: ApiRequestOptions = {}) =>
    request<T>(url, {}, { ...options, method: "GET" })

  const post = <T = any>(
    url: string,
    payload: Record<string, any> = {},
    options: ApiRequestOptions = {}
  ) => request<T>(url, payload, { ...options, method: "POST" })

  return { request, get, post }
}

// Helpers
function flattenErrors(msg?: string[] | Record<string, string>): string | null {
  if (!msg) return null
  if (Array.isArray(msg)) return msg.join("\n")
  return Object.values(msg)[0] || null
}
