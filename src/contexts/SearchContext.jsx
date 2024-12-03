import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { DEFAULT_GENRES } from '../lib/constants'
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../lib/storage'

const SearchContext = createContext()

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [availableGenres, setAvailableGenres] = useState(new Set(DEFAULT_GENRES))
  const [activeSection, setActiveSection] = useState('home')
  const [favorites, setFavorites] = useState(() => new Set(getFromStorage(STORAGE_KEYS.FAVORITES) || []))
  const [watchlist, setWatchlist] = useState(() => new Set(getFromStorage(STORAGE_KEYS.WATCHLIST) || []))
  const [videos, setVideos] = useState(() => getFromStorage(STORAGE_KEYS.VIDEOS) || [])

  // Save to storage whenever these values change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FAVORITES, Array.from(favorites))
  }, [favorites])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WATCHLIST, Array.from(watchlist))
  }, [watchlist])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VIDEOS, videos)
  }, [videos])

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

  const addVideos = useCallback((newVideos) => {
    setVideos(prev => {
      const videoMap = new Map(prev.map(v => [v.id, v]))
      newVideos.forEach(video => videoMap.set(video.id, video))
      return Array.from(videoMap.values())
    })
  }, [])

  const refreshData = useCallback(() => {
    setFavorites(new Set(getFromStorage(STORAGE_KEYS.FAVORITES) || []))
    setWatchlist(new Set(getFromStorage(STORAGE_KEYS.WATCHLIST) || []))
    setVideos(getFromStorage(STORAGE_KEYS.VIDEOS) || [])
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
    toggleWatchlist,
    videos,
    addVideos,
    refreshData,
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
