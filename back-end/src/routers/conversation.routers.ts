import { Router } from 'express'
import {
  createConversationController,
  createMessageController,
  getAllConversationController,
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
conversationRouter.get('/', accessTokenValidator, wrapAsync(getAllConversationController))
conversationRouter.post('/create', accessTokenValidator, wrapAsync(createConversationController))
conversationRouter.post('/messages', accessTokenValidator, wrapAsync(createMessageController))
conversationRouter.get('/conversations/:conversationId', accessTokenValidator, wrapAsync(getConversationController))
export default conversationRouter
