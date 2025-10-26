import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { saveSearchHistory, search, searchHistory } from '../../../apis/search.api'
import { Skeleton } from '../../../components/ui/skeleton'
import { debounce } from 'lodash'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { NavLink } from 'react-router-dom'

interface SearchPanelProps {
  searchOpen: boolean
  open: boolean
}

export default function NotifyOpen({ searchOpen, open }: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [searchOpen])

  const searchUsersQuery = useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: query.trim().length > 0
  })

  const searchHistoryQuery = useQuery({
    queryKey: ['searchHistory'],
    queryFn: () => searchHistory()
  })

  const saveHistory = useMutation({
    mutationKey: ['searchHistory'],
    mutationFn: (searchUserId: string) => saveSearchHistory(searchUserId)
  })

  const handleChange = debounce((value: string) => {
    setQuery(value)
  }, 300)

  return (
    <div
      className={`
          fixed top-0 h-full bg-white z-1 w-[450px]
          transform transition-transform duration-500 ease-out rounded-br-lg rounded-tr-lg
           ${searchOpen ? 'translate-x-2 ' : '-translate-x-full'}
        `}
      style={{ left: open ? 'var(--sidebar-width, 240px)' : '64px', boxShadow: '0 0 10px 8px rgba(0, 0, 0, 0.15)' }}
    >
      <div className='p-6'>
        <h2 className='text-2xl font-semibold my-2 pb-9'>Tìm kiếm</h2>

        <div className='relative'>
          <input
            type='text'
            placeholder='Tìm kiếm'
            onChange={(e) => handleChange(e.target.value)}
            className='w-full rounded-lg bg-[#efefef] py-3 pl-4 pr-10 
               text-base outline-none placeholder-gray-400 focus:ring-1 focus:ring-gray-300'
          />
          <button className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>✕</button>
        </div>
      </div>
      {searchUsersQuery.isLoading && (
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
      )}
      {searchUsersQuery.data ? (
        <>
          <div className='space-y-2 pt-0'>
            {Array.isArray(searchUsersQuery.data) &&
              searchUsersQuery.data.map((user) => (
                <NavLink to={`/${user.username}`} onClick={() => saveHistory.mutate(user._id as string)}>
                  <div key={user._id} className='flex items-center justify-between hover:bg-gray-100 px-6 '>
                    <div className='flex items-center space-x-4'>
                      <Avatar className='my-2 w-13 h-13'>
                        <AvatarImage className='object-cover' src={user?.profilePicture} />
                        <AvatarFallback />
                      </Avatar>
                      <div>
                        <p className='font-semibold text-base'>{user.username}</p>
                        <p className='text-gray-500 text-l'>{user.fullname}</p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className='border-t'></div>
          {searchHistoryQuery.data && searchHistoryQuery.data.length > 0 ? (
            <>
              <div className='flex items-center justify-between mb-4 px-6 pt-6'>
                <h3 className='font-semibold text-gray-800'>Mới đây</h3>
                <button className='text-blue-600 text-sm font-medium hover:underline'>Xóa tất cả</button>
              </div>
              <div className='space-y-2 pt-0'>
                {Array.isArray(searchHistoryQuery.data) &&
                  searchHistoryQuery.data.map((user) => (
                    <NavLink to={`/${user.username}`} onClick={() => saveHistory.mutate(user._id as string)}>
                      <div key={user._id} className='flex items-center justify-between hover:bg-gray-100 px-6 '>
                        <div className='flex items-center space-x-4'>
                          <Avatar className='my-2 w-13 h-13'>
                            <AvatarImage className='object-cover' src={user?.profilePicture} />
                            <AvatarFallback />
                          </Avatar>
                          <div>
                            <p className='font-semibold text-base'>{user.username}</p>
                            <p className='text-gray-500 text-l'>{user.fullname}</p>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  ))}
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  )
}
