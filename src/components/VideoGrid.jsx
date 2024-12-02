import { useState, useEffect } from 'react'
import VideoCard from './VideoCard'
import { useSearch } from '../contexts/SearchContext'

// Mock movie data for testing
const mockVideos = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genres: ["Sci-Fi", "Action"],
    poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    runtime: 148,
    director: "Christopher Nolan",
    rating: 8.8,
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    actors: [
      { name: "Leonardo DiCaprio", role: "Cobb", thumb: "https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { name: "Joseph Gordon-Levitt", role: "Arthur", thumb: "https://image.tmdb.org/t/p/w185/4U9G4YwTlIEbAymBaseltS8uqPx.jpg" }
    ]
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    runtime: 152,
    director: "Christopher Nolan",
    rating: 9.0,
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    actors: [
      { name: "Christian Bale", role: "Bruce Wayne", thumb: "https://image.tmdb.org/t/p/w185/qCpZn2e3dimwbryLnqxZuI88PTi.jpg" },
      { name: "Heath Ledger", role: "Joker", thumb: "https://image.tmdb.org/t/p/w185/5Y9HnU0riVtpBHXHcPMtpBGFHDJ.jpg" }
    ]
  }
]

function VideoGrid({ onVideoSelect }) {
  const [videos] = useState(mockVideos)
  const { 
    searchQuery, 
    selectedGenre, 
    addGenres,
    activeSection,
    favorites,
    watchlist
  } = useSearch()

  useEffect(() => {
    const allGenres = new Set(videos.flatMap(video => video.genres))
    addGenres(allGenres)
  }, [videos, addGenres])

  let filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.director?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = !selectedGenre || video.genres?.includes(selectedGenre)
    
    // Filter based on active section
    if (activeSection === 'favorites') {
      return favorites.has(video.id) && matchesSearch && matchesGenre
    }
    if (activeSection === 'watchlist') {
      return watchlist.has(video.id) && matchesSearch && matchesGenre
    }
    return matchesSearch && matchesGenre
  })

  if (filteredVideos.length === 0) {
    let message = "No videos found matching your search criteria."
    if (activeSection === 'favorites') {
      message = "No favorites yet. Click the heart icon on videos to add them to your favorites."
    } else if (activeSection === 'watchlist') {
      message = "Your watchlist is empty. Click the clock icon on videos to add them to your watchlist."
    }

    return (
      <div className="text-center text-muted-foreground py-12">
        {message}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredVideos.map(video => (
        <VideoCard 
          key={video.id} 
          video={video} 
          onClick={() => onVideoSelect(video)} 
        />
      ))}
    </div>
  )
}

export default VideoGrid
