import { HeartIcon } from 'lucide-react'
import { formatInstagramTime } from '../../../utils/time'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Comment } from '../../../types/comment.type'
import ListCommentReplies from './ListCommentReplies'
import { useState } from 'react'

type CommentItemProps = {
  comment: Comment & { isLiked: boolean }
  onReply?: ({ username, comment_id }: { username: string; comment_id: string }) => void
  onLike?: ({ commentId, parentId }: { commentId: string; parentId?: string }) => void
  onUnlike?: ({ commentId, parentId }: { commentId: string; parentId?: string }) => void
  showRepliesButton?: boolean
  isChild?: boolean
}

export default function CommentItem({ comment: c, onReply, onLike, onUnlike, isChild = false }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false)
  return (
    <div className={`flex flex-col ${isChild ? 'ml-12' : ''}`}>
      <div key={c._id} className='flex py-3'>
        {/* Avatar */}
        <div className='pr-3 flex items-start'>
          <Avatar className='my-1 w-10 h-10'>
            <AvatarImage className='object-cover' src={c.author.profilePicture} />
            <AvatarFallback />
          </Avatar>
        </div>

        {/* Nội dung comment */}
        <div className='flex flex-1 flex-col'>
          <p>
            <span className='font-semibold mr-2 text-base'>{c.author.username}</span>
            <span className='text-gray-500 text-base'>
              {c?.createdAt ? formatInstagramTime(c.createdAt.toString()) : ''}
            </span>
          </p>
          <p className='text-base whitespace-pre-wrap break-words'>{c.text}</p>
          <p className='mt-1 flex gap-4'>
            {c.likes > 0 && <span className='text-sm text-gray-500'>{c.likes} lượt thích</span>}
            <button
              type='button'
              className='text-sm text-gray-500 hover:cursor-pointer'
              onClick={() => onReply?.({ username: c.author.username as string, comment_id: c._id })}
            >
              trả lời
            </button>
          </p>
        </div>

        {/* Nút like */}
        <div className='pl-3 flex items-center'>
          {c.isLiked ? (
            <button onClick={() => onUnlike?.({ commentId: c._id })} className='hover:cursor-pointer'>
              <HeartIcon className='text-red-500 w-4.5 h-4.5 fill-red-500' />
            </button>
          ) : (
            <button onClick={() => onLike?.({ commentId: c._id })} className='hover:cursor-pointer'>
              <HeartIcon className='text-gray-500 w-4.5 h-4.5' />
            </button>
          )}
        </div>
      </div>
      {(c?.replies ?? 0) > 0 ? (
        <div className='flex items-center ml-13'>
          <div className='relative w-10'>
            <span className='bg-gray-300 h-px w-7 mr-2 absolute top-1/2' />
          </div>
          {showReplies ? (
            <button className='text-xs text-gray-500 hover:cursor-pointer' onClick={() => setShowReplies(false)}>
              Ẩn phản hồi
            </button>
          ) : (
            <button className='text-xs text-gray-500 hover:cursor-pointer' onClick={() => setShowReplies(true)}>
              Xem tất cả {c.replies} phản hồi
            </button>
          )}
        </div>
      ) : null}
      {showReplies && (
        <ListCommentReplies
          parentId={c._id}
          onLike={onLike ? (commentId: string) => onLike({ commentId, parentId: c._id }) : undefined}
          onUnlike={onUnlike ? (commentId: string) => onUnlike({ commentId, parentId: c._id }) : undefined}
          onReply={onReply ? (usernameRep: string) => onReply({ username: usernameRep, comment_id: c._id }) : undefined}
        />
      )}
    </div>
  )
}
