import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { socketAuth } from './auth.socket'
import { registerChatSocket } from './chat.socket'
import { broadcastOnlineStatus } from './presence.socket'
import { users } from './state'

let io: Server
export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', // URL của frontend
      methods: ['GET', 'POST']
    }
  })
  io = io.use(socketAuth)
  io.on('connection', async (socket) => {
    const user_id = socket.user.id
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
      console.log('user connected lalsllslsls', user_id, socket.id)
      console.log(users)
      broadcastOnlineStatus(io)
    })
    registerChatSocket(socket, user_id, io)
  })
  return io
}
export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io chưa được khởi tạo!')
  }
  return io
}
