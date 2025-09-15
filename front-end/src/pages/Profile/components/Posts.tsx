import { CameraIcon, HeartIcon, MessageCircleMoreIcon } from 'lucide-react'
import { usePostModal } from '../../../store/usePostModal.store'
import { useInfiniteQuery } from '@tanstack/react-query'
import { userPosts } from '../../../apis/profile.api'
import { NavLink, useOutletContext } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function Posts() {
  const { open } = usePostModal()
  const username = useOutletContext<string>()

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['posts', username],
    queryFn: ({ pageParam = 1 }) => userPosts(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined)
  })
  const posts = data?.pages.flatMap((page) => page.posts) ?? []

  return posts.length < 0 ? (
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
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<p>Đang tải...</p>}
        endMessage={<p className='text-center'>Hết bài viết</p>}
      >
        <div className='grid grid-cols-3 gap-1 md:gap-[3px]'>
          {posts.map((post) => (
            <NavLink to={`/p/${post._id}`} className='w-full h-full block'>
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
      </InfiniteScroll>
    </>
  )
}
