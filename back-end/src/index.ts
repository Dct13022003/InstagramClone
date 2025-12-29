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
import storyRouter from './routers/story.routers'
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
app.use('/stories', storyRouter)
app.use(defaultErrorHandler)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000' // client url
  }
})

const users: {
  [key: string]: {
    sockets: string[]
    isActiveChat: boolean
  }
} = {}

async function broadcastOnlineStatus() {
  for (const uid in users) {
    // tìm những bạn chat đã accepted
    const conversations = await Conversation.find({
      type: 'private',
      participants: {
        $elemMatch: { user: uid, status: 'accepted' }
      }
    })
    console.log(`Danh sách conversation của : ${uid}`, conversations)

    const acceptedMembers = []

    conversations.forEach((conv) => {
      conv.participants.forEach((p) => {
        if (p.user.toString() !== uid && p.status === 'accepted') {
          acceptedMembers.push(p.user.toString())
        }
      })
    })

    const uniqueUserIds = [...new Set(acceptedMembers)]

    // chỉ lấy user nào đang active-in-chat
    const activeOnlineUsers = uniqueUserIds.filter((id) => users[id]?.isActiveChat === true)

    // gửi cho tất cả socket của user uid
    users[uid].sockets.forEach((sockId) => {
      io.to(sockId).emit('online-users', activeOnlineUsers)
    })
  }
}

io.on('connection', async (socket) => {
  const rawUserId = socket.handshake.query?.user_id
  const user_id = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId
  if (!user_id || typeof user_id !== 'string') return
  if (!users[user_id]) {
    users[user_id] = { sockets: [], isActiveChat: false }
  }
  users[user_id].sockets.push(socket.id)

  console.log('user connected', user_id, socket.id)
  console.log(users)

  socket.on('disconnect', () => {
    users[user_id].sockets = users[user_id].sockets.filter((id) => id !== socket.id)

    if (users[user_id].sockets.length === 0) {
      delete users[user_id]
    }

    broadcastOnlineStatus()
  })

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
    broadcastOnlineStatus()
  })

  socket.on('off-active-in-chat', () => {
    users[user_id].isActiveChat = false
    console.log(user_id, 'rời trang chat')
    broadcastOnlineStatus()
  })
})
httpServer.listen(PORT, () => {
  connectDB()
  console.log('sever is running on port', PORT)
})
