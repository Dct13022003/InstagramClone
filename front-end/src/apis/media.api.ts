import { SuccessResponse } from '../types/utils.type'
import http from '../utils/http'

const API_URL = 'medias'
export const uploadImages = async (formData: FormData): Promise<{ url: string; type: string }[]> => {
  const { data } = await http.post<SuccessResponse<{ url: string; type: string }[]>>(
    `${API_URL}/upload-image`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return data.result
}
