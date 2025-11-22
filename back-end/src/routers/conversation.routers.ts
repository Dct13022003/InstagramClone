import { de } from '@faker-js/faker'
import { Router } from 'express'
import {
  createPrivateConversationController,
  createMessageController,
  deleteConversationController,
  getAllAcceptedConversationController,
  getAllPendingConversationController,
  getDetailConversationController,
  updateParticipantStatusController
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
conversationRouter.get('/', accessTokenValidator, wrapAsync(getAllAcceptedConversationController))
conversationRouter.post('/create', accessTokenValidator, wrapAsync(createPrivateConversationController))
conversationRouter.post('/:conversationId/messages', accessTokenValidator, wrapAsync(createMessageController))
conversationRouter.get('/:conversationId/messages', accessTokenValidator, wrapAsync(getDetailConversationController))
conversationRouter.get('/pending', accessTokenValidator, wrapAsync(getAllPendingConversationController))
conversationRouter.delete('/:conversationId', accessTokenValidator, wrapAsync(deleteConversationController))
conversationRouter.patch('/updateStatusParticipant', accessTokenValidator, wrapAsync(updateParticipantStatusController))
conversationRouter.patch('/delete/:conversationId', accessTokenValidator, wrapAsync(deleteConversationController))
export default conversationRouter
