import { Router } from 'express'
import {
  createConversationController,
  createMessageController,
  getConversationController
} from '~/controllers/conversation.controllers'
import { accessTokenValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handler'
const conversationRouter = Router()
/**
 * Description. Create conversation
 * Route: /
 * Method: POST
 * Headers: {Authorization: Bearer <access_token>}
 * Body: {text: string, mentions}
 */
conversationRouter.post('/create', wrapAsync(createConversationController))
conversationRouter.post('/messages', wrapAsync(createMessageController))
conversationRouter.get('/conversations/:conversationId', accessTokenValidator, wrapAsync(getConversationController))
export default conversationRouter
