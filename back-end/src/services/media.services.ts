import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { upload_dir } from '~/constants/dir'
import { uploadImage } from '~/utils/cloudinary'
import { getNameFromFullName, handleUploadImage } from '~/utils/file'
import fs from 'fs'

class MediaService {
  async upLoadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newPath = path.resolve(upload_dir, `${newName}.jpg`)
        // Resize and convert to JPEG format
        await sharp(file.filepath).jpeg().toFile(newPath)
        const uploadResult = await uploadImage(newPath, 'image', 'images')
        Promise.all([fs.unlinkSync(file.filepath), fs.unlinkSync(newPath)])
        return uploadResult
      })
    )
    return result
  }
}
export const mediaService = new MediaService()
