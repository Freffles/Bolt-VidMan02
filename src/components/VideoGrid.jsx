import { useState, useEffect, useRef, useCallback } from 'react'
import VideoCard from './VideoCard'
import { useSearch } from '../contexts/SearchContext'
import { getPopularMovies, searchMovies } from '../lib/tmdb.api'

function VideoGrid({ onVideoSelect }) {
  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const loader = useRef(null)
  
  const { 
    searchQuery, 
    selectedGenre,
    activeSection,
    favorites,
    watchlist,
    videos: cachedVideos,
    addVideos
  } = useSearch()

  const fetchMovies = async (pageNum, isNewSearch = false) => {
    try {
      setIsLoading(true)
      let response

      if (searchQuery) {
        response = await searchMovies(searchQuery, pageNum)
      } else {
        response = await getPopularMovies(pageNum)
      }

      // Store fetched videos in context
      addVideos(response.results)
      
      // Update local state for pagination
      setVideos(prev => isNewSearch ? response.results : [...prev, ...response.results])
      setHasMore(response.page < response.total_pages)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch movies:', err)
      setError('Failed to load movies. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Reset and fetch only when search query changes or when returning to home section
  useEffect(() => {
    const shouldFetch = searchQuery || activeSection === 'home'
    if (shouldFetch) {
      setPage(1)
      setVideos([])
      setHasMore(true)
      fetchMovies(1, true)
    }
  }, [searchQuery, activeSection])

  // Infinite scroll handler
  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if (target.isIntersecting && hasMore && !isLoading && activeSection === 'home') {
      setPage(prev => prev + 1)
    }
  }, [hasMore, isLoading, activeSection])

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    }
    const observer = new IntersectionObserver(handleObserver, option)
    if (loader.current) observer.observe(loader.current)
    
    return () => {
      if (loader.current) observer.unobserve(loader.current)
    }
  }, [handleObserver])

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 1) {
      fetchMovies(page)
    }
  }, [page])

  // Filter videos based on active section
  const filteredVideos = cachedVideos.filter(video => {
    if (activeSection === 'favorites') {
      return favorites.has(video.id)
    }
    if (activeSection === 'watchlist') {
      return watchlist.has(video.id)
    }
    if (selectedGenre) {
      return video.genre_ids?.includes(selectedGenre)
    }
    return true
  })

  // Show empty state for favorites and watchlist
  const showEmptyState = (activeSection === 'favorites' || activeSection === 'watchlist') && 
                        filteredVideos.length === 0

  return (
    <>
      {showEmptyState ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">
            {activeSection === 'favorites' ? 'No favorites yet' : 'Watchlist is empty'}
          </h3>
          <p className="text-muted-foreground">
            {activeSection === 'favorites' 
              ? 'Movies you mark as favorites will appear here'
              : 'Movies you add to your watchlist will appear here'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onVideoSelect(video)}
            />
          ))}
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted aspect-[2/3] rounded-lg mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-center text-destructive py-4">
          {error}
        </div>
      )}

      {/* Infinite scroll trigger */}
      {!error && !isLoading && hasMore && activeSection === 'home' && (
        <div ref={loader} className="h-10" />
      )}
    </>
  )
}

export default VideoGrid
