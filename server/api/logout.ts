import { apiRequest } from '../utils/apiRequest'
import { setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token")

  // If no token found → Unauthorized
  if (!token) {
    setResponseStatus(event, 401)
    return {
      error: true,
      customErrorMessage: "User Unauthenticated!",
      errorMessage: [],
      success: false,
      data: []
    }
  }

  // Call API using reusable helper
  const response = await apiRequest(event, '/driver/logout', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  // Remove auth token after successful logout
  deleteCookie(event, "auth_token")

  return response
})
