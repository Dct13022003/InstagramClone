import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'

const API_URL = 'users'
export const followUser = async (userFollowId: string) => {
  const response = await http.post<SuccessResponse<void>>(`${API_URL}/follow/${userFollowId}`)
  return response.data.result
}

export const unfollowUser = async (userUnFollowId: string) => {
  const response = await http.delete<SuccessResponse<void>>(`${API_URL}/follow/${userUnFollowId}`)
  return response.data.result
}
