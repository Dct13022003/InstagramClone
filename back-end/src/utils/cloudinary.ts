import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
})

// Upload an image
export const uploadImage = async (filePath: string, type: 'image' | 'video', folder: string) => {
  const uploadResult = await cloudinary.uploader
    .upload(filePath, {
      resource_type: type, // 'image' or 'raw'
      folder: folder // Optional: specify a folder to organize your uploads
    })
    .catch((error) => {
      console.log(error)
    })

  return uploadResult
  // Optimize delivery by resizing and applying auto-format and auto-quality
  // const optimizeUrl = cloudinary.url('shoes', {
  //   fetch_format: 'auto',
  //   quality: 'auto'
  // })

  // console.log(optimizeUrl)

  // // Transform the image: auto-crop to square aspect_ratio
  // const autoCropUrl = cloudinary.url('shoes', {
  //   crop: 'auto',
  //   gravity: 'auto',
  //   width: 500,
  //   height: 500
  // })
  // console.log(autoCropUrl)
}
