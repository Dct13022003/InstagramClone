import EmojiPicker from 'emoji-picker-react'
import { Heart, Image, Mic, SmileIcon, Sticker } from 'lucide-react'
import { useRef, useState } from 'react'

type MessageInputProps = {
  onSend: (content: string) => void
  onTypingChange?: (isTyping: boolean) => void
}

export default function MessageInput(Props: MessageInputProps) {
  const { onSend, onTypingChange } = Props
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }
  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    onTypingChange?.(true)

    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => {
      onTypingChange?.(false)
    }, 1000)
  }

  return (
    <div className='p-4 relative'>
      <form
        onSubmit={handleSubmit}
        className='flex items-center gap-3 w-full border border-gray-300 rounded-full px-4 py-2 bg-white'
      >
        <button
          ref={buttonRef}
          type='button'
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className='ml-2 bg-white text-blue-600  text-l focus:outline-none'
        >
          <SmileIcon className='w-7 h-7 text-gray-600 hover:text-gray-300' />
        </button>
        {showEmojiPicker && (
          <div ref={emojiRef} className='absolute bottom-12 right-7 top-15 z-50 '>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type='text'
          value={message}
          onChange={handleChange}
          placeholder='Nhắn tin...'
          className='flex-1 outline-none border-none bg-transparent text-l placeholder-gray-500 '
        />

        <div className='flex items-center gap-3'>
          {message.trim() ? (
            <button
              type='submit'
              className='ml-2 bg-white text-blue-600  text-l focus:outline-none absolute right-10 top-1/2 -translate-y-1/2'
            >
              Send
            </button>
          ) : (
            <>
              <Mic className='w-5 h-5 text-gray-600 cursor-pointer' />
              <Image className='w-5 h-5 text-gray-600 cursor-pointer' />
              <Sticker className='w-5 h-5 text-gray-600 cursor-pointer' />
              <Heart className='w-5 h-5 text-gray-600 cursor-pointer' />
            </>
          )}
        </div>
      </form>
    </div>
  )
}
