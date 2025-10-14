import { followService } from '~/services/follow.services'
import { TokenPayload } from '~/models/request/user.request'
import { Request, Response } from 'express'

export const followController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { user_id_follow } = req.params
  const result = await followService.follow(user_id, user_id_follow)
  return res.json({ result })
}

export const unFollowController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { user_id_unfollow } = req.params
  const result = await followService.unFollow(user_id, user_id_unfollow)
  return res.json({ result })
}

export const suggestFollowController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await followService.suggestFollow(user_id)
  return res.json({ result })
}
