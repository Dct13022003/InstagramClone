import { Request, Response } from 'express'
import { PostRequestBody } from '~/models/request/post.request'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/request/user.request'
import { postService } from '~/services/post.services'
import { POST_MESSAGES } from '~/constants/message'
import { httpStatus } from '~/constants/httpStatus'

export const createPostController = async (req: Request<ParamsDictionary, any, PostRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await postService.createPost(user_id, req.body)
  return res.json({ message: POST_MESSAGES.POST_SUCCESS, result })
}
export const getPostDetailController = async (req: Request, res: Response) => {
  const result = req.post
  return res.json({
    message: POST_MESSAGES.GET_POST_SUCCESS,
    result
  })
}
