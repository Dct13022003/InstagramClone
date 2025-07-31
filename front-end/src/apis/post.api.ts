import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'

const API_URL = 'posts'
export const createPost = async ({
  caption,
  imageUrl,
  hashtags,
  mentions
}: {
  caption: string
  imageUrl: string[]
  hashtags?: string[]
  mentions?: string[]
}): Promise<void> => {
  const response = await http.post<SuccessResponse<void>>(`${API_URL}/`, { caption, imageUrl, hashtags, mentions })
  return response.data.result
}
