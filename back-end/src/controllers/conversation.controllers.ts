import { Request, Response } from 'express'
import { TokenPayload } from '~/models/request/user.request'
import { conversationService } from '~/services/conversation.services'

export const getConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { conversationId } = req.params as { conversationId: string }
  const conversation = await conversationService.getConversation(user_id, conversationId)
  res.status(200).json({
    data: conversation
  })
}
export const getAllConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const page = parseInt(req.query.page as string)
  const limit = parseInt(req.query.limit as string)
  const conversations = await conversationService.getAllConversationService(user_id, page, limit)
  res.status(200).json({
    message: 'Get conversations successfully',
    data: conversations
  })
}

export const createConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { receiverId } = req.body as { receiverId: string }
  const conversation = await conversationService.createConversation(user_id, receiverId)
  res.status(200).json({
    message: 'Create conversation successfully',
    data: conversation
  })
}

export const deleteConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { conversationId } = req.body as { conversationId: string }
  const conversation = await conversationService.deleteConversation(user_id, conversationId)
  res.status(200).json({
    message: 'Delete conversation successfully',
    data: conversation
  })
}

export const createMessageController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { conversation_id, receiver_id, content } = req.body as {
    conversation_id: string
    receiver_id: string
    content: string
  }
  const message = await conversationService.createMessage(user_id, conversation_id, receiver_id, content)
  res.status(200).json({
    message: 'Create message successfully',
    data: message
  })
}
