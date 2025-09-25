import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/request/user.request'
import { commentService } from '~/services/comment.services'
import { COMMENT_MESSAGES, POST_MESSAGES } from '~/constants/message'
import { CommentRequestBody } from '~/models/request/comment.request'
import { Pagination, PostParam } from '~/models/request/post.request'

export const createCommentController = async (
  req: Request<ParamsDictionary, any, CommentRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const post_id = req.params.post_id
  const result = await commentService.createComment(user_id, post_id, req.body)
  return res.json({ message: POST_MESSAGES.POST_SUCCESS, result })
}
export const getCommentController = async (req: Request<PostParam, any, any, Pagination>, res: Response) => {
  const post_id = req.params.post_id
  const { user_id } = req.decode_authorization as TokenPayload
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await commentService.getAllCommentParentInPost({ post_id, limit, page, user_id })
  return res.json({ result })
}

export const getCommentRepliesController = async (req: Request<PostParam, any, any, Pagination>, res: Response) => {
  const comment_id = req.params.comment_id
  const { user_id } = req.decode_authorization as TokenPayload
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await commentService.getCommentReplies(comment_id, limit, page, user_id)
  return res.json({ result })
}

export const likeCommentController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const comment_id = req.params.comment_id
  await commentService.likeComment(user_id, comment_id)
  return res.json({ message: COMMENT_MESSAGES.LIKE_COMMENT_SUCCESS, success: true })
}

export const unlikeCommentController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const comment_id = req.params.comment_id
  await commentService.unlikeComment(user_id, comment_id)
  return res.json({ message: COMMENT_MESSAGES.UNLIKE_COMMENT_SUCCESS, success: true })
}
