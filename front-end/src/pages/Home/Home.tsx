import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchNewFeed } from '../../apis/post.api'
import InfiniteScroll from 'react-infinite-scroll-component'

import FeedCard from './components/FeedCard'

export default function Home() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['newFeeds'],
    queryFn: ({ pageParam = 1 }) => fetchNewFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.nextPage : undefined)
  })
  const newFeeds = data?.pages.flatMap((page) => page.posts) ?? []

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
              <FeedCard feed={feed} />
            ))}
          </InfiniteScroll>
        </div>
      </main>
      <div className='flex-1'>Home 2</div>
    </div>
  )
}
