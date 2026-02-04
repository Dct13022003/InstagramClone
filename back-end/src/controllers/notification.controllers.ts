import { NextFunction, Request, Response } from 'express'
import { TokenPayload } from '~/models/request/user.request'
import { notificationService } from '~/services/notification.services'

export const fetchNotifications = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await notificationService.fetchNotifications(user_id)
  return res.json({
    result
  })
}
