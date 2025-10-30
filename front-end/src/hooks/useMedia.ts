import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { uploadImages } from '../apis/media.api'

type UploadResponse = {
  url: string
  type: string
}[]

export const useUploadMedia = (): UseMutationResult<UploadResponse, Error, FormData, unknown> => {
  return useMutation({
    mutationFn: (formData: FormData) => uploadImages(formData)
  })
}
