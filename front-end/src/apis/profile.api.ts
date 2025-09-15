import { PostsPageProfile } from '../types/post.type'
import { User } from '../types/user.type'
import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'

// interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
//   password?: string
//   newPassword?: string
// }
export type ProfileResponse = {
  user: User
  followerCount: number
  followingCount: number
}
export const getProfile = async (username: string): Promise<ProfileResponse> => {
  const { data } = await http.get<SuccessResponse<ProfileResponse>>(`users/${username}`)
  return data.result
}
// updateProfile(body: BodyUpdateProfile) {
//   return http.put<SuccessResponse<User>>('users/update-profile', body)
// },
export const uploadAvatar = async (body: FormData) => {
  const { data } = await http.post<SuccessResponse<User>>('users/upload-avatar', body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export const userPosts = async (username: string, page: number, limit = 6) => {
  const { data } = await http.get<SuccessResponse<PostsPageProfile>>(`users/${username}/posts`, {
    params: {
      limit,
      page
    }
  })
  return data.result
}
