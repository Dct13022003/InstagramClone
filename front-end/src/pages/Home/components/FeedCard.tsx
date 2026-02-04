import { BookmarkIcon, HeartIcon, MessageCircleIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { useContext, useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment, likePost, unlikePost } from '../../../apis/post.api'
import { PostDetail } from '../../../types/post.type'
import { formatInstagramTime } from '../../../utils/time'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Caption from '../../../components/Caption'
import { Comment } from '../../../types/comment.type'
import { AppContext } from '../../../context/app.context'
import { User } from '../../../types/user.type'
import { SecondActionPost } from '../../../components/SecondActionPost'
import { motion } from 'framer-motion'
import { useFollowUser } from '../../../hooks/useFollowUser'

type FeedCardProps = {
  feed: PostDetail
  type?: 'follow' | 'random'
  index: number
}
export default function FeedCard({ feed, type, index }: FeedCardProps) {
  const { profile } = useContext(AppContext)
  const [content, setContent] = useState('')
  const emojiRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
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

  const { mutate: mutateFollow } = useFollowUser()
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
            posts: page.posts.map((item: any) =>
              item.post._id === postId
                ? { ...item, post: { ...item.post, isLiked: true, likesCount: item.post.likesCount + 1 } }
                : item
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
    onSuccess(data) {
      queryClient.setQueryData(['newFeeds'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((item: any) =>
              item.post._id === data._id
                ? { ...item, post: { ...item.post, isLiked: true, likesCount: data.likesCount } }
                : item
            )
          }))
        }
      })
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
            posts: page.posts.map((item: any) =>
              item.post._id === postId
                ? { ...item, post: { ...item.post, isLiked: false, likesCount: item.post.likesCount - 1 } }
                : item
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
    onSuccess(data) {
      queryClient.setQueryData(['newFeeds'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((item: any) =>
              item.post._id === data._id
                ? { ...item, post: { ...item.post, isLiked: false, likesCount: data.likesCount } }
                : item
            )
          }))
        }
      })
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
    <article key={feed._id} className='md:p-4 '>
      <div className='flex flex-col'>
        <div className='flex items-center gap-3 px-3 '>
          <Avatar className='my-6'>
            <AvatarImage className='object-cover w-10 h-10 ' src={feed.author?.profilePicture} loading='lazy' />
            <AvatarFallback />
          </Avatar>
          <div className='flex items-center justify-between flex-1'>
            <div className='flex gap-2 text-sm'>
              <NavLink to={`/${feed.author?.username}`}>
                <span className='font-semibold'>{feed.author?.username} </span>
              </NavLink>
              <span className='text-gray-500'>•</span>
              <span className=' text-gray-500'>
                {feed?.createdAt ? formatInstagramTime(feed.createdAt.toString()) : ''}
              </span>
            </div>
            <div className='flex gap-2 items-center justify-between'>
              {feed.author._id !== profile?._id && type === 'random' && (
                <>
                  <button
                    onClick={() => {
                      mutateFollow(feed.author._id as string)
                    }}
                    className='text-[#3161e9] font-semibold hover:cursor-pointer hover:underline text-sm'
                  >
                    Theo dõi
                  </button>
                </>
              )}
              <SecondActionPost isOwner={feed.author._id !== profile?._id} isFollowing={true} />
            </div>
          </div>
        </div>

        {/* Video / Hình ảnh */}
        <div className='bg-black rounded-sm overflow-hidden border-t border-b border-r border-gray-800'>
          {index === 0 ? (
            <img src={feed.images[0]} fetchPriority='high' className='w-full h-auto aspect-square' />
          ) : (
            <img src={feed.images[0]} loading='lazy' className='w-full h-auto aspect-square' />
          )}
        </div>

        <div className='px-2'>
          <div className='flex items-center gap-5 justify-between my-4'>
            <div className='flex gap-5 '>
              <div className='flex gap-2 items-center'>
                {feed?.isLiked ? (
                  <button onClick={() => unlikePostMutation.mutate(feed._id)} className='relative'>
                    <motion.div
                      whileHover={{ scale: 1.05, cursor: 'pointer' }}
                      whileTap={{ scale: 0.85 }}
                      animate={{
                        scale: [1, 1.35, 1]
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 18
                      }}
                    >
                      <HeartIcon className='w-7 h-7 fill-red-500 text-red-500' />
                    </motion.div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      likePostMutation.mutate(feed._id)
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, cursor: 'pointer' }}
                      whileTap={{ scale: 0.85 }}
                      animate={{
                        scale: [1, 1.35, 1]
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 18
                      }}
                    >
                      <HeartIcon className='w-6 h-6 font-semibold' />
                    </motion.div>
                  </button>
                )}
                <p className='font-semibold text-base text-center'>{feed.likesCount}</p>
              </div>
              <div className='flex items-center gap-2'>
                <Link to={`${feed?.author?.username}/p/${feed._id}`} state={{ backgroundLocation: location }}>
                  <motion.div
                    whileHover={{ scale: 1.05, cursor: 'pointer' }}
                    whileTap={{ scale: 0.85 }}
                    animate={{
                      scale: [1, 1.35, 1]
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 18
                    }}
                  >
                    <MessageCircleIcon className=' w-6 h-6 font-semibold' />
                  </motion.div>
                </Link>

                <p className='font-semibold text-base text-center'>{feed.commentsCount}</p>
              </div>
            </div>
            <div>
              <BookmarkIcon className='cursor-pointer w-7 h-7' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <NavLink to={`/${feed.author.username}`}>
              <span className='font-semibold text-sm text-[#0c1014]'>{feed.author.username} </span>
            </NavLink>
            <Caption text={feed.caption} />
          </div>
        </div>
      </div>
    </article>
  )
}
