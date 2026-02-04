import { Router } from 'express'
import { fetchNotifications } from '~/controllers/notification.controllers'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'

export const notificationRouter = Router()
/**
 * Description. fetch notifications
 * Route: /
 * Method: Get
 * Headers: {Authorization: Bearer <access_token>}
 */
notificationRouter.get('/', accessTokenValidator, wrapAsync(fetchNotifications))
