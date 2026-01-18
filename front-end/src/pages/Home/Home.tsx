import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { fetchNewFeed } from '../../apis/post.api'
import FeedCard from './components/FeedCard'
import { NavLink } from 'react-router-dom'
import { Avatar, AvatarImage } from '../../components/ui/avatar'
import { suggestFollow } from '../../apis/follow.api'
import { UserStories } from './components/UserStories'
import { Virtuoso } from 'react-virtuoso'
import { useMemo } from 'react'
import { FeedItem } from '../../types/post.type'

export default function Home() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['newFeeds'],
    initialPageParam: null,
    queryFn: ({ pageParam }: { pageParam: string | null }) => fetchNewFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursors ?? undefined,
    staleTime: 30000
  })

  const newFeeds = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data])

  const { data: suggestFollows } = useQuery({
    queryKey: ['suggestFollows'],
    queryFn: () => suggestFollow()
  })

  return (
    <div className='w-full flex '>
      <main className='max-w-2xl w-full flex flex-col items-center'>
        <UserStories />
        <div className='flex-1 max-w-lg w-full mx-auto '>
          <Virtuoso
            useWindowScroll
            data={newFeeds}
            endReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
            className='max-w-full'
            itemContent={(_: number, feed: FeedItem) => (
              <FeedCard feed={feed.post} type={feed.type} key={feed.post._id} />
            )}
          />
        </div>
      </main>
      <div className='flex-1 px-4 mt-9 lg:block hidden max-w-sm'>
        <div className='flex justify-around mb-3'>
          <div className='font-semibold'>
            <span>Gợi ý cho bạn</span>
          </div>
          <div>
            <NavLink to=''>
              <span className='text-sm'>Xem tất cả</span>
            </NavLink>
          </div>
        </div>
        <div className='py-3'>
          <ul>
            {suggestFollows?.map((user) => (
              <li className='mb-3' key={user._id}>
                <div className='flex items-center justify-around'>
                  <div className='flex flex-1/4 items-center justify-center'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage className='object-cover' src={user?.profilePicture} />
                    </Avatar>
                  </div>
                  <div className='flex-2/4 '>
                    <NavLink to={`${user.username}`} className='flex flex-col'>
                      <span className='font-semibold'>{user.username}</span>
                    </NavLink>

                    <div className='text-sm text-gray-500'>
                      {user.mutualFollowers?.length > 0 ? (
                        <div>
                          Có {user.mutualFollowers[0].username} theo dõi
                          {user.mutualFollowers.length > 1 && (
                            <span> và {user.mutualFollowers.length - 1} người khác</span>
                          )}
                        </div>
                      ) : (
                        <div>Gợi ý cho bạn</div>
                      )}
                    </div>
                  </div>

                  <div className='flex-1/4'>
                    <button className='text-blue-500 text-[12px] font-semibold'>Theo dõi</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
