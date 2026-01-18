import { CameraIcon, HeartIcon, MessageCircleMoreIcon } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { userPosts } from '../../../apis/profile.api'
import { NavLink, useOutletContext } from 'react-router-dom'
import { usePostModalCreatePost } from '../../../store/useCreatePostModal.store'
import { VirtuosoGrid } from 'react-virtuoso'
import React from 'react'

export default function Posts() {
  const { open } = usePostModalCreatePost()
  const username = useOutletContext<string>()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['posts', username, 'infinite'],
    queryFn: ({ pageParam }: { pageParam: string | null }) => userPosts(username, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ?? undefined
    }
  })
  const posts = React.useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data])

  return posts.length < 1 ? (
    <div className='flex justify-center items-center h-64 text-center text-gray-500 flex-col'>
      <div className='w-14 h-14 border border-black rounded-full flex items-center justify-center'>
        <CameraIcon />
      </div>
      <span
        onClick={open}
        role='button'
        tabIndex={0}
        className='text-blue-500 hover:text-black cursor-pointer text-base font-semibold'
      >
        Chia sẻ ảnh đầu tiên của bạn
      </span>
    </div>
  ) : (
    <>
      <VirtuosoGrid
        useWindowScroll
        data={posts}
        style={{ height: 'calc(100vh - 120px)' }}
        endReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        components={{
          List: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
            <div ref={ref} {...props} className='grid grid-cols-3 gap-1 md:gap-[2px]' />
          ))
        }}
        itemContent={(index, post) => {
          const col = index % 3

          return (
            <NavLink to={`/${username}/p/${post._id}`} className='block w-full h-full'>
              <div
                className={`
            w-full aspect-[3/4] bg-gray-200 relative cursor-pointer
            group overflow-hidden
            ${index < 3 && col === 0 ? 'rounded-tl-sm' : ''}
            ${index < 3 && col === 2 ? 'rounded-tr-sm' : ''}
          `}
              >
                <img
                  src={post.images?.[0] || '/placeholder.jpg'}
                  alt={post.caption ?? 'post image'}
                  loading='lazy'
                  className='w-full h-full object-cover'
                />

                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center'>
                  <div className='flex gap-5 text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transition'>
                    <div className='flex items-center gap-1'>
                      <HeartIcon />
                      <span>{post.likesCount}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <MessageCircleMoreIcon />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </NavLink>
          )
        }}
      />
    </>
  )
}
