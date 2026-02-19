import { setResponseStatus } from "h3"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD"

interface ApiRequestOptions {
  method?: HttpMethod,
  headers?: Record<string, string>
}

export async function apiRequest(
  event: any,
  endpoint: string,
  options: ApiRequestOptions = {}
) {
  const config = useRuntimeConfig()
  const method: HttpMethod = options.method || "POST"

  let body: any = undefined
  let query: any = undefined

  if (method === "GET") {
    query = getQuery(event)
  } else {
    body = await readBody(event)
  }

  try {
    return await $fetch(`${config.public.apiBaseUrl}${endpoint}`, {
      method,
      body,
      query,
      headers: {
        [config.secretHeader]: config.secretKey,
        "Content-Type": "application/json",
        ...options.headers
      }
    })
  } catch (error: any) {
    setResponseStatus(event, error?.status || 500)
    return (
      error?.data || {
        error: true,
        customErrorMessage: "Something went wrong, please try again later.",
        errorMessage: []
      }
    )
  }
}
