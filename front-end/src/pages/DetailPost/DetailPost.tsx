import { useParams } from 'react-router-dom'
import { createComment, fetchComments, getPostDetail } from '../../apis/post.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { useState } from 'react'
import ListComment from './components/ListComment'
import { Comment } from '../../types/comment.type'
import { formatInstagramTime } from '../../utils/time'

export default function DetailPost() {
  const { postId } = useParams()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostDetail(postId as string),
    enabled: !!postId
  })
  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId as string)
  })
  const commentMutation = useMutation({
    mutationFn: (content: string) => createComment(postId as string, content),
    onMutate: async (content: string) => {
      const tempId = 'temp-' + Date.now()

      await queryClient.cancelQueries({ queryKey: ['comments', postId] })

      const prev = queryClient.getQueryData<Comment[]>(['comments', postId])

      // Construct optimistic comment object
      const optimisticComment: Comment = {
        _id: tempId,
        text: content,
        parent_id: null,
        mentions: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // status: 'pending',
        // Add other required fields with default or placeholder values if needed
        author: {
          username: 'CurrentUser', // Replace with actual current user data
          profilePicture: '' // or a default avatar
        },
        post_id: postId as string
      }

      queryClient.setQueryData<Comment[]>(['comments', postId], (old = []) => [...old, optimisticComment])

      return { prev }
    },
    onError: (err, newComment, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['comments', postId], ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    }
  })

  const [input, setInput] = useState('')

  if (isLoading) return <p>Loading comments...</p>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    commentMutation.mutate(input)
    setInput('')
  }
  return (
    <div className='mx-[30.5px] pt-[32px] px-[20px] w-full'>
      <div className='flex max-w-4xl mx-auto bg-white border border-gray-300 rounded-lg overflow-hidden'>
        {/* Left: Image */}
        <div className='flex-1 bg-black flex items-center justify-center'>
          <img src={data?.images[0]} alt='post' className='object-contain max-h-[600px]' />
        </div>

        {/* Right: Content */}
        <div className='w-[350px] flex flex-col border-l border-gray-300'>
          {/* Header */}
          <div className='flex items-center px-4 py-3 border-b border-gray-200 h-[60px] gap-3'>
            <Avatar className='my-6 w-10 h-10'>
              <AvatarImage className='object-cover ' src={data?.author.profilePicture} />
              <AvatarFallback />
            </Avatar>
            <span className='font-semibold'>{data?.author.username}</span>
          </div>

          {/* Caption */}
          {data?.caption != '' && (
            <div className='px-4 py-3 text-sm'>
              <span className='font-semibold mr-2'>{data?.caption}</span>
              {data?.caption}
            </div>
          )}

          {/* Comments */}
          <ListComment postId={postId as string} />

          {/* Footer */}
          <div className='px-4 py-3 border-t border-gray-200 text-sm'>
            <p className='font-semibold text-base'>{data?.likesCount} lượt thích</p>
            <p className='text-xs text-gray-500 mt-1'>
              {data?.createdAt ? formatInstagramTime(data.createdAt.toString()) : ''}
            </p>
          </div>

          {/* Input */}
          <div className='px-4 py-3 border-t border-gray-200 relative'>
            <form onSubmit={handleSubmit} className='flex gap-2'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Nhắn tin...'
                className='w-full flex-1 border-0 px-4 py-2 focus:outline-none text-xl '
              />
              {/* <button type='submit' className='px-4 py-1 bg-blue-500 text-white rounded'>
                Send
              </button> */}
              {input.trim() && (
                <button
                  type='submit'
                  className='ml-2 bg-white text-blue-600  text-l focus:outline-none absolute right-10 top-1/2 -translate-y-1/2'
                >
                  Send
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
