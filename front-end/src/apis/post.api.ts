import { CommentResponse } from '../types/comment.type'
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
export const createComment = async ({
  postId,
  parent_id,
  text: content
}: {
  postId: string
  parent_id: string | null
  text: string
}): Promise<void> => {
  const response = await http.post<SuccessResponse<void>>(`${API_URL}/${postId}/comments`, { parent_id, text: content })
  return response.data.result
}
export const fetchComments = async (postId: string, pageParam: number): Promise<CommentResponse> => {
  const response = await http.get<SuccessResponse<CommentResponse>>(`comments/${postId}`, {
    params: {
      limit: 10,
      page: pageParam
    }
  })
  return response.data.result
}

export const fetchCommentReplies = async (comment_id: string, pageParam: number): Promise<CommentResponse> => {
  const response = await http.get<SuccessResponse<CommentResponse>>(`comments/${comment_id}/replies`, {
    params: {
      limit: 2,
      page: pageParam
    }
  })
  return response.data.result
}

export const likeComment = async (commentId: string): Promise<void> => {
  const response = await http.post<SuccessResponse<void>>(`comments/${commentId}/like`)
  return response.data.result
}
export const unlikeComment = async (commentId: string): Promise<void> => {
  const response = await http.post<SuccessResponse<void>>(`comments/${commentId}/unlike`)
  return response.data.result
}

export const likePost = async (postId: string): Promise<void> => {
  const response = await http.post<SuccessResponse<void>>(`likes/posts/${postId}`)
  return response.data.result
}

export const unlikePost = async (postId: string): Promise<void> => {
  const response = await http.delete<SuccessResponse<void>>(`likes/posts/${postId}`)
  return response.data.result
}
