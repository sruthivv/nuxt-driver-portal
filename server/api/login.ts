import { apiRequest } from '../utils/apiRequest'

export default defineEventHandler((event) => {
  return apiRequest(event, '/driver/login', { method: 'POST' })
})
