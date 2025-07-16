import { User } from '../types/user.type'
import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'

// interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
//   password?: string
//   newPassword?: string
// }

export const getMe = async (): Promise<{ user: User; followerCount: number; followingCount: number }> => {
  const { data } =
    await http.get<SuccessResponse<{ user: User; followerCount: number; followingCount: number }>>('users/me')
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
