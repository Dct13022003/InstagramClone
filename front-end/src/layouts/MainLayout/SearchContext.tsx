import { createContext, useContext } from 'react'

export const SearchContext = createContext<{
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
} | null>(null)

export const useSearchContext = () => {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used inside SearchProvider')
  return ctx
}
