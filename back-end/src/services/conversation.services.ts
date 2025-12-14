import { Conversation } from '~/models/conversation.models'
import { ObjectId } from 'mongodb'
import { Message } from '~/models/message.models'
class ConversationService {
  async getMessageInConversation({
    user_id,
    conversationId,
    page
  }: {
    user_id: string
    conversationId: string
    page: number
  }) {
    const convo = await Conversation.findById(conversationId)

    if (!convo) {
      throw new Error('Conversation not found or user not allowed')
    }
    const participant = convo.participants.find((p) => p.user.toString() === user_id.toString())

    const deletedAt = participant.deleted_at || null

    const filter = { conversation: conversationId }

    if (deletedAt) {
      filter.created_at = { $gt: deletedAt }
    }

    const messages = await Message.find(filter)
      .populate([
        { path: 'sender', select: 'username profilePicture' },
        { path: 'replyTo', select: 'type content media' }
      ])
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
      .limit(10)
      .lean()
    const totalMessages = await Message.countDocuments()
    const hasNextPage = page * 10 < totalMessages
    return { messages, hasNextPage }
  }

  async getAllConversationService(user_id: string, page: number, limit: number) {
    const conversations = await Conversation.find({
      participants: {
        $elemMatch: {
          user: user_id,
          status: 'accepted',
          is_deleted: false
        }
      }
    })
      .select('_id type last_message updatedAt createdAt')
      .populate({ path: 'last_message', populate: { path: 'sender', select: '_id' } })
      .populate({ path: 'participants.user', select: 'username profilePicture' })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    function formatConversation(conversation, currentUserId) {
      if (conversation.type === 'private') {
        const otherParticipant = conversation.participants.find(
          (p) => p.user._id.toString() !== currentUserId.toString()
        )
        return {
          ...conversation,
          displayName: otherParticipant.user.username,
          displayAvatar: otherParticipant.user.profilePicture
        }
      }
      if (conversation.type === 'group') {
        const otherParticipants = conversation.participants.filter(
          (p) => p.user._id.toString() !== currentUserId.toString()
        )
        const groupName = otherParticipants
          .slice(0, 3)
          .map((p) => p.user.username)
          .join(', ')
        const avatarMosaic = otherParticipants.slice(0, 4).map((p) => p.user.profilePicture)
        return {
          ...conversation,
          displayName: groupName,
          displayAvatarMosaic: avatarMosaic
        }
      }
      return conversation
    }

    return conversations.map((conv) => formatConversation(conv, user_id))
  }

  async createPrivateConversation(creatorId: string, recipientId: string) {
    // Kiểm tra đã có conversation 1-1 chưa
    const existing = await Conversation.findOne({
      type: 'private',
      'participants.user': { $all: [creatorId, recipientId] }
    })

    if (existing) {
      return existing // reuse conversation cũ
    }

    // Nếu chưa có → tạo mới
    const participants = [
      {
        user: creatorId,
        status: 'accepted',
        role: 'creator',
        is_deleted: false
      },
      {
        user: recipientId,
        status: 'pending', // người lạ chưa accept
        role: 'member',
        is_deleted: false
      }
    ]

    const conversation = await Conversation.create({
      type: 'private',
      participants
    })

    return conversation
  }

  /**
   * Tạo conversation nhóm
   * memberIds = array userId thành viên (không bao gồm creator)
   */
  async createGroupConversation(creatorId: string, memberIds: string[], groupName: string) {
    // Lấy tất cả conversation 1-1 của creator
    const creatorDMs = await Conversation.find({
      type: 'private',
      'participants.user': creatorId
    })
      .select('participants.user')
      .lean()

    // Map memberId -> đã từng DM với creator?
    const participants = memberIds.map((id) => {
      const hasDM = creatorDMs.some((conv) =>
        conv.participants.some((p) => p.user.toString() === id && p.status === 'accepted')
      )
      return {
        user: id,
        status: hasDM ? 'accepted' : 'pending',
        role: 'member',
        is_deleted: false
      }
    })

    // Thêm creator
    participants.push({
      user: creatorId,
      status: 'accepted',
      role: 'creator',
      is_deleted: false
    })

    const conversation = await Conversation.create({
      type: 'group',
      participants,
      name: groupName
    })

    return conversation
  }

  async deleteMessage(user_id: string, messageId: string) {
    const deletedMessage = await Message.findOneAndDelete({
      _id: new ObjectId(messageId),
      sender: new ObjectId(user_id)
    })
    return deletedMessage
  }

  async getAllPendingConversationService(user_id: string, page: number, limit: number) {
    const conversations = await Conversation.find({
      participants: {
        $elemMatch: {
          user: user_id,
          status: 'pending',
          is_deleted: false
        }
      }
    })
      .select('_id type last_message updatedAt createdAt')
      .populate({ path: 'last_message' })
      .populate({ path: 'participants.user', select: 'username profilePicture' })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    function formatConversation(conversation, currentUserId) {
      if (conversation.type === 'private') {
        const otherParticipant = conversation.participants.find(
          (p) => p.user._id.toString() !== currentUserId.toString()
        )
        return {
          ...conversation,
          displayName: otherParticipant.user.username,
          displayAvatar: otherParticipant.user.profilePicture
        }
      }
      if (conversation.type === 'group') {
        const otherParticipants = conversation.participants.filter(
          (p) => p.user._id.toString() !== currentUserId.toString()
        )
        const groupName = otherParticipants
          .slice(0, 3)
          .map((p) => p.user.username)
          .join(', ')
        const avatarMosaic = otherParticipants.slice(0, 4).map((p) => p.user.profilePicture)
        return {
          ...conversation,
          displayName: groupName,
          displayAvatarMosaic: avatarMosaic
        }
      }
      return conversation
    }

    return conversations.map((conv) => formatConversation(conv, user_id))
  }

  async updateParticipantStatus(conversationId: string, user_id: string, newStatus: string) {
    const validStatuses = ['accepted', 'pending', 'blocked']
    if (!validStatuses.includes(newStatus)) {
      throw new Error('Invalid participant status')
    }

    const result = await Conversation.updateOne(
      {
        _id: conversationId,
        'participants.user': user_id
      },
      {
        $set: {
          'participants.$.status': newStatus
        }
      }
    )

    if (result.matchedCount === 0) {
      throw new Error('Conversation or participant not found')
    }
  }
  async deleteConversation(conversationId: string, user_id: string) {
    await Conversation.updateOne(
      {
        _id: conversationId,
        'participants.user': user_id
      },
      {
        $set: {
          'participants.$.is_deleted': true,
          'participants.$.deleted_at': new Date()
        }
      }
    )
  }
}

export const conversationService = new ConversationService()
