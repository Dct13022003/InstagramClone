import { verifyToken } from '~/utils/jwt'
import { Socket } from 'socket.io'

export const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token

  if (!token) {
    return next(new Error('Unauthorized'))
  }

  try {
    const decoded = await verifyToken({ token })
    socket.user = { id: decoded.user_id }
    return next()
  } catch (err) {
    return next(new Error('Invalid token'))
  }
}
