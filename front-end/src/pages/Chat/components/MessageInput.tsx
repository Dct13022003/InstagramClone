import EmojiPicker from 'emoji-picker-react'
import { Heart, Image, Mic, SmileIcon, Sticker } from 'lucide-react'
import { useRef, useState } from 'react'
import { useUploadMedia } from '../../../hooks/useMedia'

type MessagePayload = {
  type: 'text' | 'image'
  content?: string
  url?: string
}

type MessageInputProps = {
  onSend: (payload: MessagePayload) => void
  onTypingChange?: (isTyping: boolean) => void
  optimisticUi: (payload: MessagePayload) => void
}

export default function MessageInput(Props: MessageInputProps) {
  const { mutateAsync: upload } = useUploadMedia()
  const { onSend, onTypingChange, optimisticUi } = Props
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
      optimisticUi({ content: message, type: 'text' })
      onSend({ content: message, type: 'text' })
      setMessage('')
    }
    const currentPreviews = [...previews]
    setPreviews([])
    if (currentPreviews.length > 0) {
      for (const p of previews) {
        if (!p.file) continue
        const formData = new FormData()
        formData.append('image', p.file)
        try {
          optimisticUi({ url: p.url, type: 'image' })
          const result = await upload(formData)
          if (result && result[0]?.url) {
            onSend({ type: 'image', url: result[0].url })
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
    <div className='p-4 relative'>
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
