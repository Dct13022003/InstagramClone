import { Router } from 'express'
import { uploadSingleImage } from '~/controllers/media.controller'
import { wrapAsync } from '~/utils/handler'
const mediasRouter = Router()
mediasRouter.post('/upload-image', wrapAsync(uploadSingleImage))
export default mediasRouter
