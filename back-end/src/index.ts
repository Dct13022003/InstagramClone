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
app.use('/inbox', conversationRouter)
app.use(defaultErrorHandler)

const users: { [key: string]: { socketid: string } } = {}

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000' // client url
  }
})

io.on('connection', (socket) => {
  const user_id = socket.handshake.query?.user_id as string
  users[user_id] = { socketid: socket.id }
  console.log('user connected', user_id, socket.id)
  console.log(users)
  socket.on('disconnect', () => {
    console.log('user disconnected', user_id, socket.id)
    delete users[user_id]
  })
  socket.on('send-message', async (msg) => {
    const { conversation, senderId, receiverId } = msg
    io.to(users[senderId].socketid).emit('resend-message', msg)
    if (users[receiverId]) socket.to(users[receiverId].socketid).emit('new-message', msg)
    console.log('message', msg)
    // await Message.create(msg) // Lưu tin nhắn vào cơ sở dữ liệu
  })
})
httpServer.listen(PORT, () => {
  connectDB()
  console.log('sever is running on port', PORT)
})
