import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/request/user.request'
import { commentService } from '~/services/comment.services'
import { POST_MESSAGES } from '~/constants/message'
import { CommentRequestBody } from '~/models/request/comment.request'

export const createCommentController = async (
  req: Request<ParamsDictionary, any, CommentRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await commentService.createComment(user_id, req.body)
  return res.json({ message: POST_MESSAGES.POST_SUCCESS, result })
}
