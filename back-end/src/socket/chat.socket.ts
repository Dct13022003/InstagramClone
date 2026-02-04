import { users } from './state'
import { Message } from '~/models/message.models'
import { broadcastOnlineStatus } from './presence.socket'
import { Conversation } from '~/models/conversation.models'
import { Server, Socket } from 'socket.io'

export const registerChatSocket = (socket: Socket, user_id: string, io: Server) => {
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId)
  })

  socket.on('leave-conversation', (conversationId) => {
    socket.leave(conversationId)
  })

  socket.on('send-message', async (msg, callback) => {
    const { conversation, temp_id } = msg
    try {
      const created = await Message.create(msg)
      const resend_msg = await Message.findById(created._id)
        .populate({ path: 'sender', select: 'username profilePicture' })
        .populate({
          path: 'replyTo',
          select: 'content media type sender',
          populate: {
            path: 'sender',
            select: 'fullname'
          }
        })
        .exec()
      if (!resend_msg) {
        callback({ status: 'error', message: 'message not found after create' })
        return
      }
      await Conversation.findByIdAndUpdate(conversation, { $set: { last_message: resend_msg._id } }).exec()
      const msgObj = JSON.parse(JSON.stringify(resend_msg))
      io.to(conversation).emit('new-message', { msg: msgObj, temp_id })
    } catch (err) {
      callback({ status: 'error', message: 'lỗi gửi tin nhắn' })
    }
  })

  socket.on('delete-message', async (data, callback) => {
    const { messageId, conversation } = data
    try {
      const deletedMessage = await Message.findByIdAndDelete(messageId).exec()
      const msgObj = JSON.parse(JSON.stringify(deletedMessage))
      if (deletedMessage) {
        io.to(conversation).emit('message-deleted', msgObj)
      }
    } catch (err) {
      callback({ status: 'error', message: 'lỗi xóa tin nhắn' })
    }
  })
  socket.on('typing', (data) => {
    const { roomId } = data
    socket.to(roomId).emit('display_typing', { ...data })
  })

  socket.on('seen-message', async (data) => {
    const { conversationId, userId, messageId } = data

    await Message.findByIdAndUpdate(messageId, { $addToSet: { seenBy: userId } }).exec()

    socket.to(conversationId).emit('message-seen', {
      conversationId,
      userId,
      messageId
    })
  })

  // User Online
  socket.join(user_id)

  socket.on('active-in-chat', () => {
    users[user_id].isActiveChat = true
    console.log(user_id, 'đang active chat')
    broadcastOnlineStatus(io)
  })

  socket.on('off-active-in-chat', () => {
    users[user_id].isActiveChat = false
    console.log(user_id, 'rời trang chat')
    broadcastOnlineStatus(io)
  })
}
