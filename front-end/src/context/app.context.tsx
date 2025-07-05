import { createContext, useEffect, useState } from 'react'

import { getAccessTokenFromLS, getProfileFromLS } from '../utils/auth'
import { User } from '../types/user.type'
import { Socket } from 'socket.io-client'
import { connectSocket, disconnectSocket, getSocket } from '../utils/socket'

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
    if (isAuthenticated && !socket) {
      const socket: Socket = connectSocket(profile?._id as string)
      socket.on('connect', () => {
        console.log('✅ Socket connected')
      })
      setSocket(socket)
      return () => {
        socket && disconnectSocket()
      }
    }

    // Nếu logout thì ngắt kết nối
    if (!isAuthenticated && socket) {
      disconnectSocket()
      setSocket(null)
    }
  }, [isAuthenticated])

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
