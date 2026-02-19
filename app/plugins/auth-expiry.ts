import { defineNuxtPlugin, useRouter, useCookie } from '#app'
import type { $Fetch } from 'nitropack'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const token = useCookie('auth_token')

  // Use nuxtApp.$fetch, ensured type: $Fetch
  const fetch = nuxtApp.$fetch as $Fetch

  // Wrap fetch
  nuxtApp.$fetch = (async (url: any, options: any = {}) => {
    const response = await fetch(url, options).catch((err: any) => {
      // Check token expiry or unauthorized access
      if (err?.status === 401) {
        token.value = null
        router.push('/login')
      }
      throw err
    })

    return response
  }) as any
})
