import { useState } from 'react'

type MessageInputProps = {
  onSend: (content: string) => void
}

export default function MessageInput(Props: MessageInputProps) {
  const { onSend } = Props
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  return (
    <div className='border-0 p-3 bg-white h-1/10'>
      <form onSubmit={handleSubmit} className='flex relative h-full'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Nhắn tin...'
          className='w-full flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none text-2xl '
        />
        {message.trim() && (
          <button
            type='submit'
            className='ml-2 bg-white text-blue-600  text-2xl focus:outline-none absolute right-10 top-1/2 -translate-y-1/2'
          >
            Send
          </button>
        )}
      </form>
    </div>
  )
}
