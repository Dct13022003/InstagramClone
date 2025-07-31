import { Request, Response } from 'express'
import { Pagination, PostRequestBody } from '~/models/request/post.request'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/request/user.request'
import { postService } from '~/services/post.services'
import { POST_MESSAGES } from '~/constants/message'

export const createPostController = async (req: Request<ParamsDictionary, any, PostRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await postService.createPost(user_id, req.body)
  console.log('result', result)
  return res.json({ message: POST_MESSAGES.POST_SUCCESS, result })
}
export const getPostDetailController = async (req: Request, res: Response) => {
  const result = req.post
  return res.json({
    message: POST_MESSAGES.GET_POST_SUCCESS,
    result
  })
}
export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { posts, total } = await postService.getNewFeeds({ user_id, limit, page })
  return res.json({
    user_id,
    limit,
    page,
    posts,
    total
  })
}
