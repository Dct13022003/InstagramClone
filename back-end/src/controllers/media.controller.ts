import { NextFunction, Request, Response } from 'express'
import { httpStatus } from '~/constants/httpStatus'
import { MEDIA_MESSAGES } from '~/constants/message'
import { mediaService } from '~/services/media.services'

export const uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.upLoadImage(req)
  return res.status(httpStatus.OK).json({
    message: MEDIA_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    data: result
  })
}
