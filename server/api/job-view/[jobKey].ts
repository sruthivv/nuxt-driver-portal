import { apiRequest } from '../../utils/apiRequest'
import { setResponseStatus, getRouterParam } from 'h3'

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
  // Get jobKey from route param
  const jobKey = getRouterParam(event, 'jobKey')

  return apiRequest(event, `/driver/job/${jobKey}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
})