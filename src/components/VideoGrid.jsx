import { useState, useEffect, useRef, useCallback } from 'react'
import { VideoCard } from './VideoCard'
import VideoModal from './VideoModal'
import { useSearch } from '../contexts/SearchContext'
import { useGenres } from '../contexts/GenreContext'
import { getPopularMovies, searchMovies, getMovieDetails, getMovieVideos } from '../lib/tmdb.api'
import { getTMDBImageUrl } from '../lib/tmdb.config'

/**
 * VideoGrid component for displaying a grid of video cards with infinite scrolling
 * @param {Object} props
 * @param {Array} props.videos - Optional array of videos to display instead of fetching from API
 * @param {Function} props.onVideoSelect - Function to call when a video is selected
 */
function VideoGrid({ videos: propVideos, onVideoSelect }) {
  const [videos, setVideos] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
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
  const { genres } = useGenres()

  // If videos are provided as props, use those instead of fetching
  useEffect(() => {
    if (propVideos) {
      setVideos(propVideos)
    }
  }, [propVideos])

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

  const handleTMDBVideoSelect = async (video) => {
    try {
      setIsLoadingDetails(true)
      
      // For TMDb movies, fetch additional details
      if (!video.localPath) {
        const details = await getMovieDetails(video.id)
        const videosData = await getMovieVideos(video.id)
        
        // Get trailer if available
        const trailer = videosData.results?.find(v => 
          v.type === 'Trailer' && v.site === 'YouTube'
        )
        
        // Format the data to match the VideoModal component's expected format
        const formattedVideo = {
          ...video,
          poster: getTMDBImageUrl(video.poster_path, 'large'),
          year: video.release_date ? new Date(video.release_date).getFullYear() : '',
          runtime: details.runtime || 0,
          rating: video.vote_average,
          genres: details.genres?.map(g => g.name) || [],
          director: details.credits?.crew?.find(c => c.job === 'Director')?.name || '',
          plot: video.overview || details.overview,
          mpaa: details.adult ? 'R' : 'PG-13',
          trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
        }
        setSelectedVideo(formattedVideo)
      }
    } catch (error) {
      console.error('Error fetching movie details:', error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Reset and fetch only when search query changes or when returning to home section
  useEffect(() => {
    const shouldFetch = searchQuery || activeSection === 'home'
    if (shouldFetch && !propVideos) {
      setPage(1)
      setVideos([])
      setHasMore(true)
      fetchMovies(1, true)
    }
  }, [searchQuery, activeSection])

  // Infinite scroll handler
  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if (target.isIntersecting && hasMore && !isLoading && activeSection === 'home' && !propVideos) {
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
    if (page > 1 && !propVideos) {
      fetchMovies(page)
    }
  }, [page])

  // Filter videos based on active section
  const filteredVideos = propVideos || cachedVideos.filter(video => {
    if (activeSection === 'favorites' && !propVideos) {
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
        <div className="text-center py-12" role="status" aria-live="polite">
          <h3 className="text-lg font-semibold mb-2" id="empty-state-heading">
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
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          role="grid"
          aria-label={`${activeSection === 'favorites' ? 'Favorite' : activeSection === 'watchlist' ? 'Watch later' : 'Video'} collection`}
        >
          {filteredVideos.map(video => (
            <div key={video.id} role="gridcell">
              <VideoCard
              key={video.id}
              video={video}
              onClick={() => {
                if (onVideoSelect && video.localPath) {
                  onVideoSelect(video)
                } else {
                  handleTMDBVideoSelect(video)
                }
              }}
            />
            </div>
          ))}
        </div>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6"
          role="status"
          aria-label="Loading videos"
        >
          <span className="sr-only">Loading videos...</span>
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
        <div 
          className="text-center text-destructive py-4"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {/* Infinite scroll trigger */}
      {!error && !isLoading && hasMore && activeSection === 'home' && (
        <div ref={loader} className="h-10" />
      )}
      
      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </>
  )
}

export default VideoGrid
