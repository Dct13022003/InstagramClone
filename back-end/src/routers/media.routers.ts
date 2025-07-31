import { Router } from 'express'
import { uploadSingleImage } from '~/controllers/media.controller'
import { wrapAsync } from '~/utils/handler'
const mediasRouter = Router()
/**
 * Description. Upload image
 * Route: /
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body:{media?:Media[]}
 */
mediasRouter.post('/upload-image', wrapAsync(uploadSingleImage))
export default mediasRouter
