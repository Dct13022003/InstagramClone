import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db'
import cors from 'cors'
import userRouter from './routers/user.routers'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import bookmarksRouter from './routers/bookmark.routers'
import postsRouter from './routers/post.routers'
import likeRouter from './routers/like.routers'
import { initFolder } from './utils/file'
import mediasRouter from './routers/media.routers'
import { createServer } from 'http'
import { Server } from 'socket.io'
import conversationRouter from './routers/conversation.routers'
import { Message } from './models/message.models'
import commentsRouter from './routers/comment.routers'
import searchRouter from './routers/search.routers'
import { Conversation } from './models/conversation.models'
// import '~/utils/fake'

dotenv.config({})
const PORT = process.env.PORT || 8000
const app = express()

initFolder()

app.use(express.json())
app.use(cookieParser())
const corsOptions = {
  origin: 'http://localhost:3000', // client url
  credentials: true // required to pass
}
app.use(cors(corsOptions))
app.use('/users', userRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likeRouter)
app.use('/posts', postsRouter)
app.use('/medias', mediasRouter)
app.use('/conversations', conversationRouter)
app.use('/comments', commentsRouter)
app.use('/search', searchRouter)
app.use(defaultErrorHandler)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000' // client url
  }
})
// map userId -> array of socket ids
const users: { [key: string]: string[] } = {}

io.on('connection', (socket) => {
  const rawUserId = socket.handshake.query?.user_id
  const user_id = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId
  if (!user_id || typeof user_id !== 'string') return
  if (!users[user_id]) {
    users[user_id] = []
  }
  users[user_id].push(socket.id)

  console.log('user connected', user_id, socket.id)
  console.log(users)

  socket.on('disconnect', () => {
    console.log('user disconnected', user_id, socket.id)
    users[user_id] = users[user_id].filter((id) => id !== socket.id)
    if (users[user_id].length === 0) {
      delete users[user_id]
    }
  })

  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId)
    console.log('ROOOM  : ', io.sockets.adapter.rooms)
  })

  socket.on('leave-conversation', (conversationId) => {
    socket.leave(conversationId)
  })

  socket.on('send-message', async (msg, callback) => {
    const { conversation, sender } = msg
    try {
      const conv = await Conversation.findById(conversation)
      if (!conv) {
        callback({ status: 'error', message: 'Conversation not found' })
        return
      }

      const participant = conv.participants.find((p) => p.user.toString() === sender.toString())

      if (participant && participant.is_deleted) {
        await Conversation.updateOne(
          {
            _id: conversation,
            'participants.user': sender
          },
          {
            $set: {
              'participants.$.is_deleted': false,
              'participants.$.deleted_at': null
            }
          }
        )
      }

      const created = await Message.create(msg)

      const resend_msg = await Message.findById(created._id)
        .populate({ path: 'sender', select: 'username profilePicture' })
        .populate({
          path: 'replyTo',
          select: 'content media type sender',
          populate: { path: 'sender', select: 'fullname' }
        })
        .exec()

      if (!resend_msg) {
        callback({ status: 'error', message: 'Message not found after creation' })
        return
      }

      await Conversation.findByIdAndUpdate(conversation, { $set: { lastMessage: resend_msg._id } }).exec()

      const msgObj = JSON.parse(JSON.stringify(resend_msg))
      io.to(conversation).emit('new-message', msgObj)

      callback({ status: 'ok', data: created._id })
    } catch (err) {
      console.error('Error in send-message:', err)
      callback({ status: 'error', message: 'Error sending message' })
    }
  })

  socket.on('delete-message', async (data, callback) => {
    const { messageId, conversation } = data
    try {
      const deletedMessage = await Message.findByIdAndDelete(messageId).exec()
      const msgObj = JSON.parse(JSON.stringify(deletedMessage))
      console.log('Deleted message:', deletedMessage)
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

  socket.on('user-online', (data) => {
    const { userId } = data
    const socketIds = users[userId] || []
    socketIds.forEach((id) => {
      io.to(id).emit('friend-online', { userId })
    })
  })
})
httpServer.listen(PORT, () => {
  connectDB()
  console.log('sever is running on port', PORT)
})
