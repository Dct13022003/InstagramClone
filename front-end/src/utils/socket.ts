import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (user_id: string): Socket => {
  if (!socket) {
    socket = io('http://localhost:8000', {
      query: { user_id },
      autoConnect: false
    })
    socket.connect()
  }
  return socket
}

export const getSocket = (): Socket | null => socket

export const disconnectSocket = (sock?: Socket) => {
  if (sock) {
    sock.disconnect()
  }
  socket = null
}
