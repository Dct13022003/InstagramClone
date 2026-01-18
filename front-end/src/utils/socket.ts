import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const connectSocket = (): Socket => {
  const token = localStorage.getItem('access_token')
  if (!socket) {
    socket = io('http://localhost:8000', {
      auth: { token: token },
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
