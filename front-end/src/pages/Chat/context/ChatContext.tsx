import { createContext, useContext, useState } from 'react'
import { Message } from '../../../types/chat.type'

interface ChatContextType {
  showModal: boolean
  setShowModal: (value: boolean) => void
  replyingToMessage: Message | null
  setReplyingToMessage: (message: Message | null) => void
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider = ({ children }) => {
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null)
  const [showModal, setShowModal] = useState(false)

  return (
    <ChatContext.Provider value={{ replyingToMessage, setReplyingToMessage, showModal, setShowModal }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)
