import { Comment } from '../types/comment.type'
import { PostProfile } from '../types/post.type'
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
export const getPostDetail = async (postId: string): Promise<PostProfile> => {
  const response = await http.get<SuccessResponse<PostProfile>>(`${API_URL}/${postId}`)
  return response.data.result
}
export const createComment = async (postId: string, content: string): Promise<void> => {
  const response = await http.post<SuccessResponse<void>>('comments/', { postId, content })
  return response.data.result
}
export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const response = await http.get<SuccessResponse<Comment[]>>(`comments/${postId}`)
  return response.data.result
}
