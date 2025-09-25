import { fetchCommentReplies } from '../../../apis/post.api'
import { useInfiniteQuery } from '@tanstack/react-query'
import CommentItem from './CommentItem'

type ListCommentRepliesProps = {
  parentId: string
  onLike?: (commentId: string) => void
  onReply?: (username: string) => void
  onUnlike?: (commentId: string) => void
}

export default function ListCommentReplies({ parentId, onLike, onUnlike, onReply }: ListCommentRepliesProps) {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['replies', parentId],
    queryFn: ({ pageParam = 1 }) => fetchCommentReplies(parentId as string, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined)
  })
  const commentsReplies = data ? data.pages.flatMap((page) => page.comments) : []
  return (
    <div>
      {commentsReplies.map((c) => (
        <CommentItem
          key={c._id}
          comment={c}
          onLike={onLike ? ({ commentId }) => onLike(commentId) : undefined}
          onUnlike={onUnlike ? ({ commentId }) => onUnlike(commentId) : undefined}
          onReply={onReply ? ({ username }) => onReply(username) : undefined}
          isChild={true}
        />
      ))}
      {hasNextPage && (
        <div className='flex items-center ml-13'>
          <div className='relative w-10'>
            <span className='bg-gray-300 h-px w-7 mr-2 absolute top-1/2' />
          </div>
          <button className='text-xs text-gray-500 hover:cursor-pointer' onClick={() => fetchNextPage()}>
            Hiển thị thêm bình luận
          </button>
        </div>
      )}
    </div>
  )
}
