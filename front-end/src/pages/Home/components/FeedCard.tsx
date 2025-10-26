import { BookmarkIcon, HeartIcon, MessageCircleIcon, SmileIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { useContext, useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment, likePost, unlikePost } from '../../../apis/post.api'
import { PostDetail } from '../../../types/post.type'
import { formatInstagramTime } from '../../../utils/time'
import EmojiPicker from 'emoji-picker-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { followUser } from '../../../apis/follow.api'
import Caption from '../../../components/Caption'
import { Comment } from '../../../types/comment.type'
import { AppContext } from '../../../context/app.context'
import { User } from '../../../types/user.type'

type FeedCardProps = {
  feed: PostDetail
}
export default function FeedCard({ feed }: FeedCardProps) {
  const { profile } = useContext(AppContext)
  const [content, setContent] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [localComments, setLocalComments] = useState<Comment[]>([])
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  const commentMutation = useMutation({
    mutationFn: ({ content, postId }: { content: string; postId: string }) =>
      createComment({ postId, parent_id: null, text: content }),

    onMutate: async ({ content, postId }) => {
      const temp_id = `temp-${Date.now()}`
      const tempComment: Comment & { isLiked: boolean } = {
        _id: temp_id,
        text: content,
        author: profile as User,
        post_id: postId,
        mentions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLiked: false
      }

      setLocalComments((prev) => [...prev, tempComment])

      // ✅ return context
      return { temp_id }
    },

    onSuccess: (data, _variables, context) => {
      if (!context) return
      setLocalComments((prev) => prev.map((c) => (c._id === context.temp_id ? data : c)))
    },

    onError: (_error, _variables, context) => {
      if (!context) return
      setLocalComments((prev) => prev.filter((c) => c._id !== context.temp_id))
    }
  })

  const { mutate: mutateFollow } = useMutation({
    mutationFn: followUser
  })

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['newFeeds'] })

      const prevData = queryClient.getQueryData(['newFeeds'])

      queryClient.setQueryData(['newFeeds'], (old: any) => {
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((p: any) =>
              p._id === postId ? { ...p, liked: true, likesCount: p.likesCount + 1 } : p
            )
          }))
        }
      })

      return { prevData }
    },
    onError: (err, variables, context) => {
      // rollback nếu lỗi
      queryClient.setQueryData(['newFeeds'], context?.prevData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['newFeeds'] })
    }
  })

  const unlikePostMutation = useMutation({
    mutationFn: (postId: string) => unlikePost(postId),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ['newFeeds'] })

      const prevData = queryClient.getQueryData(['newFeeds'])

      queryClient.setQueryData(['newFeeds'], (old: any) => {
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((p: any) =>
              p._id === postId ? { ...p, liked: true, likesCount: p.likesCount - 1 } : p
            )
          }))
        }
      })

      return { prevData }
    },
    onError: (err, variables, context) => {
      // rollback nếu lỗi
      queryClient.setQueryData(['newFeeds'], context?.prevData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['newFeeds'] })
    }
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

  const handleOpenPost = (username: string, postId: string) => {
    if (!username) return

    navigate(`/${username}/p/${postId}`, {
      state: { backgroundLocation: (location.pathname = `/${username}`) }
    })
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return

    el.style.height = 'auto'
    const newHeight = Math.min(el.scrollHeight, 4 * 24)
    el.style.height = newHeight + 'px'
  }
  return (
    <article className='p-4 border-b' key={feed._id}>
      <div className='flex items-center gap-3 mb-3 '>
        <Avatar className='my-6'>
          <AvatarImage className='object-cover w-10 h-10 ' src={feed.author.profilePicture} />
          <AvatarFallback />
        </Avatar>
        <div className='flex gap-2 text-base'>
          <NavLink to={`/${feed.author.username}`}>
            <span className='font-semibold'>{feed.author.username} </span>
          </NavLink>
          <span className='text-gray-500'>•</span>
          <span className=' text-gray-500'>
            {feed?.createdAt ? formatInstagramTime(feed.createdAt.toString()) : ''}
          </span>
          <span className='text-gray-500'>•</span>
          <button
            onClick={() => {
              mutateFollow(feed.author._id as string)
            }}
            className='text-blue-600 font-semibold hover:cursor-pointer hover:underline'
          >
            Theo dõi
          </button>
        </div>
      </div>

      {/* Video / Hình ảnh */}
      <div className='bg-black rounded-lg overflow-hidden'>
        <img src={feed.images[0]} className='w-full h-auto' />
      </div>

      {/* Các nút tương tác */}
      <div className='flex items-center gap-5 justify-between my-4'>
        <div className='flex gap-4'>
          {feed?.isLiked ? (
            <button
              onClick={() => {
                unlikePostMutation.mutate(feed._id)
              }}
            >
              <HeartIcon className='hover:text-gray-500 fill-red-500 text-red-500' />
            </button>
          ) : (
            <button
              onClick={() => {
                likePostMutation.mutate(feed._id)
              }}
            >
              <HeartIcon className='hover:text-gray-500' />
            </button>
          )}
          <button onClick={() => handleOpenPost(feed.author.username as string, feed._id)}>
            <MessageCircleIcon className='cursor-pointer w-7 h-7' />
          </button>
        </div>
        <div>
          <BookmarkIcon className='cursor-pointer w-7 h-7' />
        </div>
      </div>
      <div className='my-2.5'>
        <span className='font-semibold'>{feed.likesCount} lượt thích</span>
      </div>
      <div className='my-2.5'>
        <NavLink to={`/${feed.author.username}`}>
          <span className='font-semibold'>{feed.author.username} </span>
        </NavLink>
        <Caption text={feed.caption} />
      </div>
      <div className='text-gray-500'>Xem tất cả {feed.commentsCount} bình luận</div>
      {localComments.length > 0 &&
        localComments.map((c) => (
          <div className='my-1.5'>
            <NavLink to={`/${c.author.username}`}>
              <span className='font-semibold'>{profile?.username} </span>
            </NavLink>
            <span>{c.text} </span>
          </div>
        ))}
      <div className='flex items-center w-full '>
        <div className=' border-gray-200 relative flex-1 '>
          <form onSubmit={handleSubmit} id={feed._id} className='flex flex-1 gap-2'>
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              rows={1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Bình luận...'
              className='flex-1 border-0 py-2 focus:outline-none text-base resize-none'
            />
            {content.trim() && (
              <button type='submit' className='ml-2 bg-white text-blue-600  text-l focus:outline-none'>
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
          <SmileIcon className='w-4 h-4 text-gray-600 hover:text-gray-300' />
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
