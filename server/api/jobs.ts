import { apiRequest } from '../utils/apiRequest'
import { setResponseStatus, getQuery } from 'h3'

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

  const query = getQuery(event)
  const type = Array.isArray(query.type) ? query.type[0] : query.type || "assigned"

  const validTypes = ["assigned", "accepted", "completed"]
  const jobType = validTypes.includes(type) ? type : "assigned"

  return apiRequest(event, `/driver/jobs/${jobType}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  })
})
