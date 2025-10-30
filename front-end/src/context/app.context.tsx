import { createContext, useEffect, useState } from 'react'

import { getAccessTokenFromLS, getProfileFromLS } from '../utils/auth'
import { User } from '../types/user.type'
import { Socket } from 'socket.io-client'
import { connectSocket, disconnectSocket } from '../utils/socket'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  socket: Socket | null
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
}

export const getInitialAppContext: () => AppContextInterface = () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  socket: null,
  setSocket: () => null
})

const initialAppContext = getInitialAppContext()

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const [socket, setSocket] = useState<Socket | null>(null)

  // Kết nối socket khi đã đăng nhập
  useEffect(() => {
    if (isAuthenticated && profile?._id) {
      if (!socket) {
        const newSocket = connectSocket(profile._id)

        newSocket.on('connect', () => console.log('✅ Socket connected'))
        newSocket.on('disconnect', () => console.log('❌ Socket disconnected'))

        setSocket(newSocket) // ⚡ Trigger re-render context
      }
    } else {
      if (socket) {
        disconnectSocket(socket)
        setSocket(null)
      }
    }

    return () => {
      if (socket) {
        disconnectSocket(socket)
        setSocket(null)
      }
    }
  }, [isAuthenticated, profile?._id])

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        socket,
        setSocket
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
