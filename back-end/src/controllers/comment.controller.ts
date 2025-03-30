import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/request/user.request'
import { commentService } from '~/services/comment.services'
import { POST_MESSAGES } from '~/constants/message'
import { CommentRequestBody } from '~/models/request/comment.request'
import { Pagination, PostParam } from '~/models/request/post.request'

export const createCommentController = async (
  req: Request<ParamsDictionary, any, CommentRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await commentService.createComment(user_id, req.body)
  return res.json({ message: POST_MESSAGES.POST_SUCCESS, result })
}
export const getCommentController = async (req: Request<PostParam, any, any, Pagination>, res: Response) => {
  const post_id = req.params.post_id
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = commentService.getAllCommentInPost({ post_id, limit, page })
  return res.json(result)
}
