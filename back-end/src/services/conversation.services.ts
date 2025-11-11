import { Conversation } from '~/models/conversation.models'
import { ObjectId } from 'mongodb'
import { Message } from '~/models/message.models'
class ConversationService {
  async getConversation({ user_id, conversationId, page }: { user_id: string; conversationId: string; page: number }) {
    const messages = await Message.find({ conversation: conversationId })
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
    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: new ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants_info'
        }
      },
      {
        $addFields: {
          // Lọc ra những người tham gia KHÔNG PHẢI bạn
          other_participants: {
            $filter: {
              input: '$participants_info',
              as: 'participant',
              cond: {
                $ne: ['$$participant._id', new ObjectId(user_id)]
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          is_group: 1,
          last_message: 1,
          updated_at: 1,
          other_participants: 1
        }
      },
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ])
    return conversations
  }
  async createConversation(user_id: string, receiverId: string) {
    const existingConversation = await Conversation.findOne({
      participants: { $all: [new ObjectId(user_id), new ObjectId(receiverId)] }
    })
    if (existingConversation) {
      return existingConversation
    }

    const newConversation = new Conversation({
      participants: [new ObjectId(user_id), new ObjectId(receiverId)]
    })
    await newConversation.save()
    return newConversation
  }
  async deleteConversation(user_id: string, conversationId: string) {
    // Xóa cuộc trò chuyện
    const deletedConversation = await Conversation.findOneAndDelete({
      _id: new ObjectId(conversationId),
      participants: new ObjectId(user_id) // Chỉ xóa nếu người dùng là một trong những người tham gia
    })
    return deletedConversation
  }

  async createMessage(user_id: string, conversation_id: string, receiver_id: string, content: string) {
    // Tạo tin nhắn mới

    // Cập nhật cuộc trò chuyện với tin nhắn mới
    const newMessage = await Message.create({
      senderId: new ObjectId(user_id),
      receiverId: new ObjectId(receiver_id),
      content,
      conversation: new ObjectId(conversation_id)
    }) // Lưu tin nhắn vào cơ sở dữ liệu
    return newMessage
  }
  async deleteMessage(user_id: string, messageId: string) {
    const deletedMessage = await Message.findOneAndDelete({
      _id: new ObjectId(messageId),
      sender: new ObjectId(user_id)
    })
    return deletedMessage
  }
}
export const conversationService = new ConversationService()
