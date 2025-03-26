import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKE_MESSAGES } from '~/constants/message'
import { likePostRequestBody } from '~/models/request/like.requset'
import { TokenPayload } from '~/models/request/user.request'
import { likeService } from '~/services/like.services'

export const likeController = async (req: Request<ParamsDictionary, any, likePostRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const post_id = req.body.post_id
  await likeService.createLike(user_id, post_id)
  res.status(201).json({
    message: LIKE_MESSAGES.LIKE_SUCCESS,
    success: true
  })
}

export const unlikeController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const post_id = req.params.post_id
  await likeService.unLike(user_id, post_id)
  res.status(201).json({
    message: LIKE_MESSAGES.UNLIKE_SUCCESS,
    success: true
  })
}
