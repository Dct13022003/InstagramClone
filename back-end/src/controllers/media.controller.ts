import { NextFunction, Request, Response } from 'express'
import { mediaService } from '~/services/media.services'

export const uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
  const data = await mediaService.upLoadImage(req)
  return res.json(data)
}
