import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { search } from '../../../apis/search.api'
import { Skeleton } from '../../../components/ui/skeleton'
import { debounce } from 'lodash'

interface SearchPanelProps {
  searchOpen: boolean
  open: boolean
}

export default function SearchOpen({ searchOpen, open }: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [searchOpen])

  const { data, isLoading } = useQuery({
    queryKey: ['search'],
    queryFn: () => search(query),
    enabled: query.trim().length > 0
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
      {isLoading && (
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[250px]' />
            <Skeleton className='h-4 w-[200px]' />
          </div>
        </div>
      )}
      {data ? (
        <>
          <div className='border-t'></div>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-semibold text-gray-800'>Mới đây</h3>
              <button className='text-blue-600 text-sm hover:underline'>Xóa tất cả</button>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl text-gray-600'>
                    #
                  </div>
                  <div>
                    <p className='font-semibold text-sm'>#happybirthday</p>
                    <p className='text-gray-500 text-xs'>140 triệu bài viết</p>
                  </div>
                </div>
                <button className='text-gray-500 hover:text-gray-700 text-lg'>✕</button>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <img src='https://i.pravatar.cc/40' alt='avatar' className='w-10 h-10 rounded-full' />
                  <div>
                    <p className='font-semibold text-sm'>hieuu.149</p>
                    <p className='text-gray-500 text-xs'>Trương Minh Hiếu</p>
                  </div>
                </div>
                <button className='text-gray-500 hover:text-gray-700 text-lg'>✕</button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
