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
    <form onSubmit={handleSubmit} className='border-t border-gray-200 p-4 flex'>
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Nhắn tin...'
        className='flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500'
      />
      <button
        type='submit'
        className='ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none'
      ></button>
    </form>
  )
}
