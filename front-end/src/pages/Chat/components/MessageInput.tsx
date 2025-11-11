import EmojiPicker from 'emoji-picker-react'
import { Heart, Image, Mic, SmileIcon, Sticker } from 'lucide-react'
import { useContext, useRef, useState } from 'react'
import { useUploadMedia } from '../../../hooks/useMedia'
import { Message } from '../../../types/chat.type'
import { AppContext } from '../../../context/app.context'

type MessagePayload = {
  temp_id: string
  type: 'text' | 'image'
  content?: string
  url?: string
  replyTo?: string
}

type MessagePayloadOptimistic = {
  type: 'text' | 'image'
  content?: string
  url?: string
  replyTo?: Message
}

type MessageInputProps = {
  onSend: (payload: MessagePayload) => void
  onTypingChange?: (isTyping: boolean) => void
  optimisticUi: (payload: MessagePayloadOptimistic) => string | undefined
  onReply?: Message | null
  onCancelReply?: () => void
}

export default function MessageInput(Props: MessageInputProps) {
  const { profile } = useContext(AppContext)
  const { mutateAsync: upload } = useUploadMedia()
  const { onSend, onTypingChange, optimisticUi, onReply, onCancelReply } = Props
  const [previews, setPreviews] = useState<{ file: File | null; url: string; id: string }[]>([])
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const inputRef = useRef<React.Ref<HTMLInputElement> | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files)
    const urls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2)
    }))
    setPreviews((prev) => [...prev, ...urls])
    inputRef.current?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData
    if (!data) return
    const items = [...data.items].filter((i) => i.type.startsWith('image/'))
    if (items.length > 0) {
      const urls = items.map((item) => {
        const file = item.getAsFile()
        return {
          file,
          url: URL.createObjectURL(file ?? new Blob()),
          id: Math.random().toString(36).slice(2)
        }
      })
      setPreviews((prev) => [...prev, ...urls])
    }
  }

  const handleRemoveImage = (id) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim()) {
      const temp_id = optimisticUi({ content: message, type: 'text', replyTo: onReply })
      onSend({ temp_id, content: message, type: 'text', replyTo: onReply?._id })
      setMessage('')
    }
    const currentPreviews = [...previews]
    setPreviews([])
    onCancelReply()
    if (currentPreviews.length > 0) {
      for (const p of previews) {
        if (!p.file) continue
        const formData = new FormData()
        formData.append('image', p.file)
        try {
          const temp_id = optimisticUi({ url: p.url, type: 'image', replyTo: onReply })
          const result = await upload(formData)
          if (result && result[0]?.url) {
            onSend({ temp_id, type: 'image', url: result[0].url, replyTo: onReply?._id })
          }
        } catch (err) {
          console.error('Upload failed:', err)
        }
      }
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
    <div className={`p-4 relative ${onReply && 'border-t-1'}`}>
      {onReply && (
        <div className='mb-2 p-2rounded-lg flex justify-between items-center'>
          <div className='flex-col'>
            <span>Đang trả lời {onReply.sender._id === profile?._id ? 'chính mình' : ''} </span>
            <div>
              {onReply.type === 'text' && <span className='italic'>{onReply.content}</span>}
              {onReply.type === 'image' && <span className='text-base text-gray-400'>Hình ảnh</span>}
            </div>
          </div>

          <button onClick={onCancelReply} className='text-gray-500 hover:text-gray-700 self-start'>
            ✖
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
          }
        }}
        className={`items-center w-full border border-gray-300 px-4 py-2 bg-white ${previews ? 'rounded-2xl' : 'rounded-full'}`}
      >
        {previews.length > 0 && (
          <div className='flex gap-2 mb-2 overflow-x-auto'>
            {previews.map((p) => (
              <div key={p.id} className='relative w-20 h-20 flex-shrink-0'>
                <img src={p.url} alt='preview' className='w-20 h-20 object-cover rounded-lg bg-gray-100' />
                <button
                  onClick={() => handleRemoveImage(p.id)}
                  className='absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs border'
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

        <div className='flex gap-3'>
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
            ref={inputRef}
            value={message}
            onChange={handleChange}
            placeholder='Nhắn tin...'
            className='flex-1 outline-none border-none bg-transparent text-l placeholder-gray-500 '
          />

          <div className='flex items-center gap-3'>
            {message.trim() || previews.length > 0 ? (
              <button
                type='submit'
                className='ml-2 bg-white text-blue-600  text-l focus:outline-none absolute right-10 top-1/2 -translate-y-1/2'
              >
                Send
              </button>
            ) : (
              <>
                <Mic className='w-5 h-5 text-gray-600 cursor-pointer' />
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  ref={fileInputRef}
                  className='hidden'
                  onChange={handleFileChange}
                />
                <button type='button' onClick={() => fileInputRef.current?.click()}>
                  <Image className='w-5 h-5 text-gray-600 cursor-pointer' />
                </button>
                <Sticker className='w-5 h-5 text-gray-600 cursor-pointer' />
                <Heart className='w-5 h-5 text-gray-600 cursor-pointer' />
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
