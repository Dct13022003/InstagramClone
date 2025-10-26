import { User } from '../types/user.type'
import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'
const API_URL = 'search'

export const search = async (query: string) => {
  const response = await http.get<SuccessResponse<User[]>>(`${API_URL}/`, {
    params: { q: query, page: 1, limit: 6 }
  })
  return response.data.result
}

export const searchHistory = async () => {
  const response = await http.get<SuccessResponse<User[]>>(`${API_URL}/history`)
  return response.data.result
}

export const saveSearchHistory = async (searchUserId: string) => {
  const response = await http.post<SuccessResponse<null>>(`${API_URL}/history`, { searchUserId })
  return response.data.result
}
