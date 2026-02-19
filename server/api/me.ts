import { apiRequest } from '../utils/apiRequest'
import { setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token")

  if (!token) {
    setResponseStatus(event, 401)
    return {
      error: true,
      customErrorMessage: "Unauthenticated",
      data: null
    }
  }

  return apiRequest(event, '/driver/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})
