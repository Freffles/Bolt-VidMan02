import { useSearch } from '../contexts/SearchContext'
import { Input } from './ui/input'
import { Search as SearchIcon } from 'lucide-react'

/**
 * SearchInput component for searching videos
 * Provides a search input with icon and handles search queries
 */
function SearchInput() {
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <div className="relative" role="search">
      <label htmlFor="video-search" className="sr-only">Search videos</label>
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Input
        type="search"
        placeholder="Search videos..."
        className="w-full pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        id="video-search"
        aria-label="Search videos"
      />
    </div>
  )
}

export default SearchInput
