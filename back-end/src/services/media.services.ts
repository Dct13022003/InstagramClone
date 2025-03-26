import { Request } from 'express'
import { handleUploadImage } from '~/utils/file'

class MediaService {
  async upLoadImage(req: Request) {
    const files = await handleUploadImage(req)
    Promise.all(files.map(async (file) => {}))
  }
}
export const mediaService = new MediaService()
