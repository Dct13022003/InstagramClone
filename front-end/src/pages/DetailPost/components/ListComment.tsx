import { useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { AppContext } from '../../../context/app.context'
import { Comment } from '../../../types/comment.type'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { HeartIcon } from 'lucide-react'

export default function ListComment({ postId }: { postId: string }) {
  const queryClient = useQueryClient()
  const comments = queryClient.getQueryData<Comment[]>(['comments', postId]) || []
  console.log('ListComment render', comments)
  const { socket } = useContext(AppContext)
  useEffect(() => {
    if (!socket) {
      console.log('Không có socket')
      return
    }
    socket.emit('join_post', postId)

    socket.on('new_comment', (comment) => {
      queryClient.setQueryData<Comment[]>(['comments', postId], (old = []) => {
        // tránh trùng (nếu comment đã có do optimistic UI)
        if (old.find((c) => c._id === comment._id)) return old
        return [...old, comment]
      })
    })

    return () => {
      socket.off('new_comment')
    }
  }, [postId, queryClient, socket])
  return (
    <div className='flex-1 px-4 overflow-y-auto text-sm w-full '>
      {comments.map((c) => (
        <div key={c._id} className='flex py-3 '>
          <div className='pr-3 flex items-start'>
            <Avatar className='my-6 w-10 h-10 '>
              <AvatarImage className='object-cover' src={c.author.profilePicture} />
              <AvatarFallback />
            </Avatar>
          </div>
          <div className='flex flex-1 flex-col'>
            <p>
              <span className='font-semibold mr-2 text-base'>{c.author.username}</span>
              <span className='text-gray-500 text-base'>{new Date(c.createdAt).toLocaleString()}</span>
            </p>
            <p>
              <span className='text-base '>{c.text}</span>
            </p>
            <p className='mt-1 flex gap-4'>
              {c.likes > 0 && <span className='text-sm text-gray-500'>{c.likes} lượt thích</span>}
              <span className='text-sm text-gray-500'>trả lời</span>
            </p>
          </div>
          <div className='pl-3 flex items-center'>
            <button>
              <HeartIcon className='text-gray-500 w-4.5 h-4.5' />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
