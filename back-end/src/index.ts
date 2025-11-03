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

// map userId -> array of socket ids
const users: { [key: string]: string[] } = {}

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000' // client url
  }
})

io.on('connection', (socket) => {
  const rawUserId = socket.handshake.query?.user_id
  const user_id = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId
  if (!user_id || typeof user_id !== 'string') return

  // --- Thêm socket mới của user ---
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

  socket.on('send-message', async (msg) => {
    const { conversation } = msg
    const resend_msg = await Message.create(msg)
    await resend_msg.populate('sender', 'username profilePicture')
    const msgObj = JSON.parse(JSON.stringify(resend_msg))
    console.log('Message: ', msgObj)
    socket.to(conversation).emit('new-message', resend_msg)
  })

  socket.on('typing', (data) => {
    const { roomId } = data
    socket.to(roomId).emit('display_typing', { ...data })
  })
})
httpServer.listen(PORT, () => {
  connectDB()
  console.log('sever is running on port', PORT)
})
