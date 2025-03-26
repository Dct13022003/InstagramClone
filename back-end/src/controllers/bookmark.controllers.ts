import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARK_MESSAGES } from '~/constants/message'
import { bookmarkPostRequestBody } from '~/models/request/bookmark.request'
import { TokenPayload } from '~/models/request/user.request'
import { bookmarkService } from '~/services/bookmark.services'

export const bookmarkController = async (
  req: Request<ParamsDictionary, any, bookmarkPostRequestBody>,
  res: Response
) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const post_id = req.body.post_id
  await bookmarkService.createBookmark(user_id, post_id)
  res.status(201).json({
    message: BOOKMARK_MESSAGES.BOOKMARK_SUCCESS,
    success: true
  })
}

export const unBookmarkController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const post_id = req.params.post_id
  await bookmarkService.unBookmark(user_id, post_id)
  res.status(201).json({
    message: BOOKMARK_MESSAGES.UNBOOKMARK_SUCCESS,
    success: true
  })
}
