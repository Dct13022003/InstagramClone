import { Request, Response } from 'express'
import {  PostRequestBody } from '~/models/request/post.request'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/request/user.request'
import { postService } from '~/services/post.services'
import { POST_MESSAGES } from '~/constants/message'

export const createPostController = async (req: Request<ParamsDictionary, any, PostRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await postService.createPost(user_id, req.body)
  return res.json({ message: POST_MESSAGES.POST_SUCCESS, result })
}
export const getPostDetailController = async (req: Request, res: Response) => {
  const post_id = req.params.post_id
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await postService.getPostDetail(post_id, user_id)
  return res.json({
    message: POST_MESSAGES.GET_POST_SUCCESS,
    result
  })
}
export const getNewFeedsController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const limit = Number(req.query.limit) || 10
  const cursor = req.query.cursor as string | undefined
  const decodedCursor = cursor ? JSON.parse(Buffer.from(cursor, 'base64').toString()) : null
  const result = await postService.getNewFeeds({ user_id, limit, decodedCursor })
  return res.json({
    result
  })
}
