import { BookmarkIcon, HeartIcon, MessageCircleIcon, SmileIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createComment } from '../../../apis/post.api'
import { PostDetail } from '../../../types/post.type'
import { formatInstagramTime } from '../../../utils/time'
import EmojiPicker from 'emoji-picker-react'

type FeedCardProps = {
  feed: PostDetail
}
export default function FeedCard({ feed }: FeedCardProps) {
  const [content, setContent] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const commentMutation = useMutation({
    mutationFn: ({ content, postId }: { content: string; postId: string }) =>
      createComment({ postId: postId as string, parent_id: null, text: content })
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    commentMutation.mutate({
      content: content.trim(),
      postId: feed._id
    })

    setContent('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    setContent((prev) => prev + emojiData.emoji)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return

    el.style.height = 'auto'
    const newHeight = Math.min(el.scrollHeight, 4 * 24)
    el.style.height = newHeight + 'px'
  }
  return (
    <article className='p-4 border-b' key={feed._id}>
      <div className='flex items-center gap-3 mb-3'>
        <Avatar className='my-6'>
          <AvatarImage className='object-cover w-10 h-10' src={feed.author.username} />
          <AvatarFallback />
        </Avatar>
        <div>
          <span className='font-semibold'>{feed.author.username}</span>
          <span className='text-xs text-gray-500'>
            {feed?.createdAt ? formatInstagramTime(feed.createdAt.toString()) : ''}
          </span>
        </div>
      </div>

      {/* Video / Hình ảnh */}
      <div className='bg-black rounded-lg overflow-hidden'>
        <img src={feed.images[0]} className='w-full h-auto' />
      </div>

      {/* Các nút tương tác */}
      <div className='flex items-center gap-5 justify-between my-4'>
        <div className='flex gap-4'>
          <HeartIcon className='cursor-pointer w-7 h-7' />
          <MessageCircleIcon className='cursor-pointer w-7 h-7' />
        </div>
        <div>
          <BookmarkIcon className='cursor-pointer w-7 h-7' />
        </div>
      </div>
      <div className='my-2.5'>
        <span className='font-semibold'>{feed.likesCount} lượt thích</span>
      </div>
      <div className='my-2.5'>
        <span className='font-semibold'>{feed.author.username} </span>
        <span>{feed.caption}</span>
      </div>
      <div>Xem tất cả {feed.commentsCount} bình luận</div>

      <div className='flex pt-3 items-center w-full '>
        <div className=' py-3 border-gray-200 relative flex-1 '>
          <form onSubmit={handleSubmit} className='flex gap-2'>
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              rows={1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Bình luận...'
              className=' border-0 flex-1 py-2 focus:outline-none text-base resize-none'
            />
            {content.trim() && (
              <button
                type='submit'
                className='ml-2 bg-white text-blue-600  text-l focus:outline-none absolute right-0 top-1/2 -translate-y-1/2'
              >
                Đăng
              </button>
            )}
          </form>
        </div>

        <button
          ref={buttonRef}
          type='button'
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className='ml-2 relative'
        >
          <SmileIcon className='w-7 h-7 text-gray-600 hover:text-gray-300' />
        </button>
        {showEmojiPicker && (
          <div ref={emojiRef} className='absolute bottom-12 right-7 top-15 z-50 '>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </article>
  )
}
