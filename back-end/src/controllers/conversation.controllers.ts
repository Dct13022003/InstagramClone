import { Request, Response } from 'express'
import { TokenPayload } from '~/models/request/user.request'
import { conversationService } from '~/services/conversation.services'

export const getDetailConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const page = parseInt(req.query.page as string)
  const { conversationId } = req.params as { conversationId: string }
  const conversation = await conversationService.getMessageInConversation({ user_id, conversationId, page })
  res.status(200).json({
    result: conversation
  })
}
export const getAllAcceptedConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const page = parseInt(req.query.page as string)
  const limit = parseInt(req.query.limit as string)
  const conversations = await conversationService.getAllConversationService(user_id, page, limit)
  res.status(200).json({
    message: 'Get conversations successfully',
    result: conversations
  })
}

export const getAllPendingConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const page = parseInt(req.query.page as string)
  const limit = parseInt(req.query.limit as string)
  const conversations = await conversationService.getAllPendingConversationService(user_id, page, limit)
  res.status(200).json({
    message: 'Get pending conversations successfully',
    result: conversations
  })
}

export const createPrivateConversationController = async (req: Request, res: Response) => {
  const { user_id: creatorId } = req.decode_authorization as TokenPayload
  const { recipientId } = req.body as { recipientId: string }
  const conversation = await conversationService.createPrivateConversation(creatorId, recipientId)
  res.status(200).json({
    message: 'Create conversation successfully',
    result: conversation
  })
}

export const createGroupConversationController = async (req: Request, res: Response) => {
  try {
    const { memberIds, groupName } = req.body
    const { user_id: creatorId } = req.decode_authorization as TokenPayload

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: 'Member IDs are required' })
    }

    const conversation = await conversationService.createGroupConversation(creatorId, memberIds, groupName || '')
    return res.status(200).json({ conversation })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}

export const deleteConversationController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { conversationId } = req.params
  const conversation = await conversationService.deleteConversation(conversationId, user_id)
  res.status(200).json({
    message: 'Delete conversation successfully',
    result: conversation
  })
}

export const deleteMessageController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { messageId } = req.body as { messageId: string }
  const message = await conversationService.deleteMessage(user_id, messageId)
  res.status(200).json({
    message: 'Delete message successfully',
    result: message
  })
}

export const updateParticipantStatusController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { newStatus, conversationId } = req.body
  await conversationService.updateParticipantStatus(conversationId, user_id, newStatus)
  res.status(200).json({
    message: 'Update status participant success'
  })
}
