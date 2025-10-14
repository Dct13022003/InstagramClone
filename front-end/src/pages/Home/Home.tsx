import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { fetchNewFeed } from '../../apis/post.api'
import InfiniteScroll from 'react-infinite-scroll-component'
import FeedCard from './components/FeedCard'
import { NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { suggestFollow } from '../../apis/follow.api'

export default function Home() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['newFeeds'],
    queryFn: ({ pageParam = 1 }) => fetchNewFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined)
  })
  const newFeeds = data?.pages.flatMap((page) => page.posts) ?? []

  const { data: suggestFollows } = useQuery({
    queryKey: ['suggestFollows'],
    queryFn: () => suggestFollow()
  })

  return (
    <div className='w-full flex '>
      <main className=' max-w-3xl w-full mx-auto border-l flex justify-center'>
        <div className='flex-1 max-w-xl '>
          <InfiniteScroll
            dataLength={newFeeds.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<div className='text-center py-2 text-gray-500'>Đang tải...</div>}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {newFeeds.map((feed) => (
              <FeedCard feed={feed} key={feed._id} />
            ))}
          </InfiniteScroll>
        </div>
      </main>
      <div className='flex-1 px-4 mt-9'>
        <div className='flex justify-between'>
          <div className='text-gray-500'>
            <span>gợi ý cho bạn</span>
          </div>
          <div>
            <NavLink to=''>
              <span className='text-sm'>Xem tất cả</span>
            </NavLink>
          </div>
        </div>
        <div className='py-3'>
          {suggestFollows?.map((user) => (
            <div key={user._id} className='flex items-center justify-between'>
              <div>
                <Avatar className='my-6'>
                  <AvatarImage className='object-cover w-10 h-10 ' src={user.profilePicture} />
                  <AvatarFallback />
                </Avatar>
              </div>
              <div className='flex-row'>
                <div>
                  <span className='font-semibold'>{user.username}</span>
                </div>
                <div className='text-sm text-gray-500'>
                  {user.mutualFollowers?.length > 0 ? (
                    <div>
                      Có {user.mutualFollowers[0].username} theo dõi
                      {user.mutualFollowers.length > 1 && <span> và {user.mutualFollowers.length - 1} người khác</span>}
                    </div>
                  ) : (
                    <div>Gợi ý cho bạn</div>
                  )}
                </div>
              </div>
              <div>
                <button className='text-blue-500'>Theo dõi</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
