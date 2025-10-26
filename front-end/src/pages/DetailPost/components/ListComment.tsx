import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Comment, CommentResponse } from '../../../types/comment.type'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchComments, likeComment, unlikeComment } from '../../../apis/post.api'
import CommentItem from './CommentItem'
import { PostDetail } from '../../../types/post.type'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { formatInstagramTime } from '../../../utils/time'

export default function ListComment({
  postId,
  onReply,
  postDetail
}: {
  postId: string
  onReply?: ({ username, comment_id }: { username: string; comment_id: string }) => void
  postDetail: PostDetail | null
}) {
  const queryClient = useQueryClient()
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 1 }) => fetchComments(postId as string, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined)
  })

  const comments = data ? data.pages.flatMap((page) => page.comments) : []

  const likeCommentMutation = useMutation({
    mutationFn: ({ commentId }: { commentId: string; parentId?: string }) => likeComment(commentId),

    onMutate: async ({ commentId, parentId }) => {
      const queryKey = parentId ? ['replies', parentId] : ['comments', postId]

      await queryClient.cancelQueries({ queryKey })
      const prevData = queryClient.getQueryData<CommentResponse>(queryKey)

      // update cache optimistic
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData
        const newPages = oldData.pages.map((page: any) => {
          const newComments = page.comments.map((c: Comment) =>
            c._id === commentId ? { ...c, isLiked: true, likes: c.likes + 1 } : c
          )
          return { ...page, comments: newComments }
        })
        return { ...oldData, pages: newPages }
      })

      return { prevData, queryKey }
    },

    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(context.queryKey, context.prevData)
      }
    },

    onSettled: (_data, _err, vars) => {
      const queryKey = vars.parentId ? ['replies', vars.parentId] : ['comments', postId]
      queryClient.invalidateQueries({ queryKey })
    }
  })

  const unlikeCommentMutation = useMutation({
    mutationFn: ({ commentId }: { commentId: string; parentId?: string }) => unlikeComment(commentId),
    onMutate: async ({ commentId, parentId }) => {
      const queryKey = parentId ? ['replies', parentId] : ['comments', postId]
      await queryClient.cancelQueries({ queryKey })
      const prevData = queryClient.getQueryData<CommentResponse>(queryKey)
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData
        const newPages = oldData.pages.map((page: any) => {
          const newComments = page.comments.map((c: Comment) =>
            c._id === commentId ? { ...c, isLiked: true, likes: c.likes - 1 } : c
          )
          return { ...page, comments: newComments }
        })
        return { ...oldData, pages: newPages }
      })

      return { prevData, queryKey }
    },
    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(context.queryKey, context.prevData)
      }
    },

    onSettled: (_data, _err, vars) => {
      const queryKey = vars.parentId ? ['replies', vars.parentId] : ['comments', postId]
      queryClient.invalidateQueries({ queryKey })
    }
  })

  const handleLikeComment = ({ commentId, parentId }: { commentId: string; parentId?: string }) => {
    likeCommentMutation.mutate({ commentId, parentId })
  }

  const handleUnlikeComment = ({ commentId, parentId }: { commentId: string; parentId?: string }) => {
    unlikeCommentMutation.mutate({ commentId, parentId })
  }

  return (
    <>
      {comments.length === 0 ? (
        <div className='flex-1 flex items-center justify-center py-2 text-gray-500'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-black'>Chưa có bình luận nào.</p>
            <p>Bắt đầu trò chuyện</p>
          </div>
        </div>
      ) : (
        <div id='scrollableDiv' className='flex-1 overflow-y-auto px-4'>
          <InfiniteScroll
            dataLength={comments.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<div className='text-center py-2 text-gray-500'>Đang tải...</div>}
            scrollableTarget='scrollableDiv'
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {postDetail?.caption != '' && (
              <div className='flex py-3'>
                {/* Avatar */}
                <div className='pr-3 flex items-start'>
                  <Avatar className='my-1 w-10 h-10'>
                    <AvatarImage className='object-cover' src={postDetail?.author.profilePicture} />
                    <AvatarFallback />
                  </Avatar>
                </div>

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
            {comments.map((c) => (
              <CommentItem
                key={c._id}
                comment={c}
                onReply={onReply}
                onLike={handleLikeComment}
                onUnlike={handleUnlikeComment}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </>
  )
}
