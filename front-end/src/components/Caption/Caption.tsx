import { useState } from 'react'

interface CaptionProps {
  text: string
  limit?: number 
}

export default function Caption({ text, limit = 120 }: CaptionProps) {
  const [expanded, setExpanded] = useState(false)

  if (text.length <= limit) {
    return <p className='text-sm'>{text}</p>
  }

  return (
    <div className='text-sm'>
      {expanded ? text : text.slice(0, limit) + '...'}
      <button onClick={() => setExpanded(!expanded)} className='text-blue-500 ml-2 hover:underline'>
        {expanded ? 'Thu gọn' : 'Xem thêm'}
      </button>
    </div>
  )
}
