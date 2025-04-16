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

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000' // client url
  }
})

io.on('connection', (socket) => {
  console.log(socket)
})
httpServer.listen(PORT, () => {
  connectDB()
  console.log('sever is running on port', PORT)
})
