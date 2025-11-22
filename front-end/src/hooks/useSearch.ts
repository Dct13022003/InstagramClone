import { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { debounce } from 'lodash'
import { saveSearchHistory, search, searchHistory } from '../apis/search.api'

export function useSearch() {
  const [query, setQuery] = useState('')

  const searchUsersQuery = useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: query.trim().length > 0,
    staleTime: Infinity,
    gcTime: Infinity
  })

  const searchHistoryQuery = useQuery({
    queryKey: ['searchHistory'],
    queryFn: () => searchHistory()
  })

  const saveHistory = useMutation({
    mutationKey: ['searchHistory'],
    mutationFn: (searchUserId: string) => saveSearchHistory(searchUserId)
  })

  const handleChange = useMemo(() => debounce((value: string) => setQuery(value), 300), [])

  return {
    query,
    setQuery,
    handleChange,
    searchUsersQuery,
    searchHistoryQuery,
    saveHistory
  }
}
