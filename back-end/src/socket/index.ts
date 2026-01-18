import { Server } from 'socket.io'
import { socketAuth } from './auth.socket'
import { registerChatSocket } from './chat.socket'

export const initSocket = (io: Server) => {
  io.use(socketAuth)
  registerChatSocket(io)
}
