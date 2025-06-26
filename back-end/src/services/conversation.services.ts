import { Conversation } from '~/models/conversation.models'
import { ObjectId } from 'mongodb'
import { Message } from '~/models/message.models'
class ConversationService {
  async getConversation({ user_id, conversationId, page }: { user_id: string; conversationId: string; page: number }) {
    // Simulate a database call to get conversation
    const messages = await Message.find({
      conversation: new ObjectId(conversationId)
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .select('-__v')
      .lean()
    const totalMessages = await Message.countDocuments()
    const hasNextPage = page * 10 < totalMessages
    return { messages, hasNextPage }
  }
  async getAllConversationService(user_id: string, page: number, limit: number) {
    // Simulate a database call to get all conversations for a user
    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: new ObjectId(user_id) // Chỉ lấy conversation có bạn tham gia
        }
      },
      {
        $lookup: {
          from: 'users', // Collection users
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
          other_participants: 1 // Chỉ giữ lại thông tin người khác
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
    // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
    const existingConversation = await Conversation.findOne({
      participants: { $all: [new ObjectId(user_id), new ObjectId(receiverId)] }
    })
    if (existingConversation) {
      return existingConversation
    }

    // Tạo cuộc trò chuyện mới nếu chưa tồn tại
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
}
export const conversationService = new ConversationService()
