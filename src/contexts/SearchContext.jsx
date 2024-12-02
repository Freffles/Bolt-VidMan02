import { createContext, useContext, useState, useCallback } from 'react'
import { DEFAULT_GENRES } from '../lib/constants'

const SearchContext = createContext()

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [availableGenres, setAvailableGenres] = useState(new Set(DEFAULT_GENRES))
  const [activeSection, setActiveSection] = useState('home')
  const [favorites, setFavorites] = useState(new Set())
  const [watchlist, setWatchlist] = useState(new Set())

  const addGenre = useCallback((newGenre) => {
    setAvailableGenres(prev => new Set([...prev, newGenre]))
  }, [])

  const addGenres = useCallback((newGenres) => {
    setAvailableGenres(prev => new Set([...prev, ...newGenres]))
  }, [])

  const toggleFavorite = useCallback((movieId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(movieId)) {
        newFavorites.delete(movieId)
      } else {
        newFavorites.add(movieId)
      }
      return newFavorites
    })
  }, [])

  const toggleWatchlist = useCallback((movieId) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev)
      if (newWatchlist.has(movieId)) {
        newWatchlist.delete(movieId)
      } else {
        newWatchlist.add(movieId)
      }
      return newWatchlist
    })
  }, [])

  const value = {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    availableGenres,
    addGenre,
    addGenres,
    activeSection,
    setActiveSection,
    favorites,
    toggleFavorite,
    watchlist,
    toggleWatchlist
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
