import { NavLink, useParams } from 'react-router-dom'
import { createComment, getPostDetail, likePost, unlikePost } from '../../apis/post.api'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { useContext, useEffect, useRef, useState } from 'react'
import ListComment from './components/ListComment'
import { Comment, CommentResponse } from '../../types/comment.type'
import { formatInstagramTime } from '../../utils/time'
import EmojiPicker from 'emoji-picker-react'
import { BookmarkIcon, HeartIcon, MessageCircleIcon, MessageCircleMoreIcon, SmileIcon } from 'lucide-react'
import { Tooltip } from '../../components/ui/tooltip'
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { AppContext } from '../../context/app.context'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../components/ui/carousel'
import { userPosts } from '../../apis/profile.api'

export default function DetailPost() {
  const { profile } = useContext(AppContext)
  const [content, setContent] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [reply, setReplyTo] = useState<string | null>(null)
  const emojiRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { postId } = useParams()
  const queryClient = useQueryClient()
  const { username } = useParams()

  const { data: postDetail, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostDetail(postId as string),
    enabled: !!postId
  })

  const { data: relatePosts } = useInfiniteQuery({
    queryKey: ['posts', username, 'infinite'],
    queryFn: ({ pageParam = 1 }) => userPosts(username as string, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined)
  })

  const posts = relatePosts?.pages.flatMap((page) => page.posts) ?? []

  const commentMutation = useMutation({
    mutationFn: (content: string) => createComment({ postId: postId as string, parent_id: reply, text: content }),

    onMutate: async (content: string) => {
      const tempId = 'temp-' + Date.now()

      // xác định queryKey tùy vào gốc hay reply
      const queryKey = reply ? ['replies', reply] : ['comments', postId]

      await queryClient.cancelQueries({ queryKey })

      const prevData = queryClient.getQueryData<CommentResponse>(queryKey)

      const optimisticComment: Comment = {
        _id: tempId,
        text: content,
        mentions: null,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          username: profile?.username || 'you',
          profilePicture: profile?.profilePicture || '/default-avatar.png'
        },
        post_id: postId as string,
        parent_id: reply || null
      }

      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) {
          return {
            pages: [{ comments: [optimisticComment], hasNextPage: true, nextPage: 2 }],
            pageParams: [1]
          }
        }
        return {
          ...oldData,
          pages: oldData.pages.map((page: any, i: number) =>
            i === 0 ? { ...page, comments: [...page.comments, optimisticComment] } : page
          )
        }
      })

      return { prevData, queryKey }
    },

    onError: (err, newComment, ctx) => {
      if (ctx?.prevData) {
        queryClient.setQueryData(ctx.queryKey, ctx.prevData)
      }
    },

    onSettled: (data, error, variables, ctx) => {
      if (ctx?.queryKey) {
        queryClient.invalidateQueries({ queryKey: ctx.queryKey })
      }
    }
  })

  const likePostMutation = useMutation({
    mutationFn: () => likePost(postId as string),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] })
      const prevData = queryClient.getQueryData(['post', postId])
      queryClient.setQueryData(['post', postId], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          isLiked: true,
          likesCount: oldData.likesCount + 1
        }
      })
      return { prevData }
    },
    onError: (err, newComment, ctx) => {
      if (ctx?.prevData) queryClient.setQueryData(['post', postId], ctx.prevData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    }
  })

  const unlikePostMutation = useMutation({
    mutationFn: () => unlikePost(postId as string),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] })
      const prevData = queryClient.getQueryData(['post', postId])
      queryClient.setQueryData(['post', postId], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          isLiked: false,
          likesCount: oldData.likesCount - 1
        }
      })
      return { prevData }
    },
    onError: (err, newComment, ctx) => {
      if (ctx?.prevData) queryClient.setQueryData(['post', postId], ctx.prevData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    commentMutation.mutate(content.trim())
    setContent('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleEmojiClick = (emojiData: any) => {
    setContent((prev) => prev + emojiData.emoji)
  }

  const handleReply = ({ username, comment_id }: { username: string; comment_id: string }) => {
    setReplyTo(comment_id)
    setContent(`@${username} `)
    textareaRef.current?.focus()
  }

  const handleLikePost = () => {
    likePostMutation.mutate()
  }

  const handleUnlikePost = () => {
    unlikePostMutation.mutate()
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

  if (isLoading) return <div>Loading...</div>
  return (
    <div className='mx-[30.5px] pt-[32px] px-[20px]'>
      <div className=' w-full'>
        <div className='flex max-w-4xl mx-auto bg-white border border-gray-300 rounded-lg overflow-hidden'>
          {/* Left: Image */}
          <div className='flex-1 relative'>
            <Carousel className='w-full h-full flex items-center'>
              <CarouselContent className='h-full '>
                {postDetail?.images.map((src, idx) => (
                  <CarouselItem key={idx} className='h-full flex items-center justify-center'>
                    <img src={src} className='w-full h-full object-contain' />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {postDetail?.images.length > 1 && (
                <>
                  <CarouselPrevious className='absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2' />
                  <CarouselNext className='absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full p-2' />
                </>
              )}
            </Carousel>
          </div>

          {/* Right: Content */}
          <div className='w-[350px] h-screen flex flex-col border-l border-gray-300'>
            {/* Header */}
            <div className='flex items-center px-4 py-3 border-b border-gray-200 h-[60px] gap-3'>
              <Avatar className='my-6 w-10 h-10'>
                <AvatarImage className='object-cover ' src={postDetail?.author.profilePicture} />
                <AvatarFallback />
              </Avatar>
              <NavLink to={`/${username}`} className='font-semibold'>
                {postDetail?.author.username}
              </NavLink>
              {username != postDetail?.author.username && (
                <div>
                  <div className=''></div>
                  <button className='text-blue-600 font-semibold hover:underline'>Theo dõi</button>
                </div>
              )}
            </div>

            {/* Caption */}
            {postDetail?.caption != '' && (
              <div className='flex py-3 px-4'>
                {/* Avatar */}
                <div className='pr-3 flex items-start'>
                  <Avatar className='my-1 w-10 h-10'>
                    <AvatarImage className='object-cover' src={postDetail?.author.profilePicture} />
                    <AvatarFallback />
                  </Avatar>
                </div>

                {/* Nội dung comment */}
                <div className='flex flex-1 flex-col'>
                  <p>
                    <span className='font-semibold mr-2 text-base'>{postDetail?.author.username}</span>
                    <span className='text-gray-500 text-base'>
                      {postDetail?.createdAt ? formatInstagramTime(postDetail.createdAt.toString()) : ''}
                    </span>
                  </p>
                  <p className='text-base whitespace-pre-wrap break-all'>{postDetail?.caption}</p>
                </div>
              </div>
            )}

            {/* Comments */}
            <ListComment postId={postId as string} onReply={handleReply} />

            {/* Footer */}

            <div className='px-4 pt-3 border-t border-gray-200 text-sm '>
              <div className='flex items-center justify-between mb-1'>
                <div className='flex gap-4'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {postDetail?.isLiked ? (
                        <button onClick={handleUnlikePost}>
                          <HeartIcon className='hover:text-gray-500 fill-red-500 text-red-500' />
                        </button>
                      ) : (
                        <button onClick={handleLikePost}>
                          <HeartIcon className='hover:text-gray-500' />
                        </button>
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>thích</p>
                    </TooltipContent>
                  </Tooltip>

                  <button
                    onClick={() => {
                      textareaRef.current?.focus()
                    }}
                  >
                    <MessageCircleIcon className='hover:text-gray-500' />
                  </button>
                </div>
                <div>
                  <button>
                    <BookmarkIcon className='hover:text-gray-500' />
                  </button>
                </div>
              </div>
              <p className='font-semibold text-base'>{postDetail?.likesCount} lượt thích</p>
              <p className='text-xs text-gray-500 mt-1'>
                {postDetail?.createdAt ? formatInstagramTime(postDetail.createdAt.toString()) : ''}
              </p>
            </div>

            {/* Input */}
            <div className='flex px-4 pt-3 items-center w-full '>
              <Avatar className='my-6 w-10 h-10 '>
                <AvatarImage className='object-cover ' src={postDetail?.author.profilePicture} />
                <AvatarFallback />
              </Avatar>
              <div className=' py-3  border-gray-200 relative flex-1 '>
                <form onSubmit={handleSubmit} className='flex gap-2'>
                  <textarea
                    ref={textareaRef}
                    onInput={handleInput}
                    rows={1}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='Bình luận...'
                    className=' border-0 px-4 py-2 focus:outline-none text-base resize-none'
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
          </div>
        </div>
      </div>
      <div className='border-t border-gray-500 max-w-full mt-12'></div>
      <div className='mt-12'>
        <div className='mb-5'>
          <p className='text-gray-500 font-medium'>
            Thêm các bài viết từ{' '}
            <NavLink to={`/${username}`} className='text-black hover:underline'>
              {username}
            </NavLink>
          </p>
        </div>
        <div className='grid grid-cols-3 gap-2 md:gap-[3px]'>
          {posts.map((post) => (
            <NavLink to={`/${username}/p/${post._id}`} className='w-full h-full block'>
              <div key={post._id} className='w-full aspect-[3/4] bg-gray-200 relative cursor-pointer group '>
                <img src={post.images[0]} alt={post.caption} className='w-full h-full object-cover' />

                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center'>
                  <div className='flex gap-5 text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition'>
                    <div className='flex items-center gap-1'>
                      <HeartIcon /> <span> {post.likesCount}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <MessageCircleMoreIcon /> <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
