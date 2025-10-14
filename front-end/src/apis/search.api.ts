import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'
const API_URL = 'search'

export const search = async (q: string) => {
  const response = await http.post<SuccessResponse<void>>(`${API_URL}/`, {
    params: { q: q, page: 1, limit: 6 }
  })
  return response.data.result
}
