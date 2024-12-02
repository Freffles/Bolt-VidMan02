import { useSearch } from '../contexts/SearchContext'
import { Input } from './ui/input'
import { Search as SearchIcon } from 'lucide-react'

function SearchInput() {
  const { searchQuery, setSearchQuery } = useSearch()

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search videos..."
        className="w-full pl-8"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}

export default SearchInput
