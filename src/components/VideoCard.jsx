import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Heart, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { useSearch } from '../contexts/SearchContext'
import { useGenres } from '../contexts/GenreContext'
import { useState, useEffect } from 'react'

/**
 * VideoCard component displays a movie card with poster, title, and interactive buttons
 * @param {Object} props
 * @param {Object} props.video - Movie data from TMDB API or local video data
 * @param {Function} props.onClick - Click handler for the card
 */
export function VideoCard({ video, onClick }) {
  const { favorites, toggleFavorite, watchlist, toggleWatchlist } = useSearch()
  const { genres } = useGenres()

  const [imageError, setImageError] = useState(false)
  const [posterUrl, setPosterUrl] = useState(null)

  useEffect(() => {
    const loadPoster = async () => {
      if (video.localPath && video.posterPath) {
        try {
          const imageData = await window.api.readImage(video.posterPath)
          setPosterUrl(imageData)
        } catch (error) {
          console.error('Error loading poster:', error)
          setImageError(true)
        }
      }
    }
    
    if (video.localPath) {
      loadPoster()
    }
  }, [video])

  const imageUrl = video.localPath 
    ? (posterUrl || '/placeholder-poster.jpg')
    : `https://image.tmdb.org/t/p/w500${video.poster_path}`

  const title = video.localPath ? video.title : video.title
  const rating = video.localPath ? video.rating : video.vote_average
  const year = video.localPath ? video.year : new Date(video.release_date).getFullYear()
  const isFavorite = favorites.has(video.id)
  const isInWatchlist = watchlist.has(video.id)

  return (
    <Card className={`overflow-hidden group ${video.localPath ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="relative aspect-[2/3]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
          onClick={onClick}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 bg-black/50 hover:bg-black/70 text-white rounded-full ${isFavorite ? 'text-red-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(video.id)
            }}
          >
            <Heart className="h-3.5 w-3.5" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 bg-black/50 hover:bg-black/70 text-white rounded-full ${isInWatchlist ? 'text-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              toggleWatchlist(video.id)
            }}
          >
            <Clock className="h-3.5 w-3.5" fill={isInWatchlist ? "currentColor" : "none"} />
          </Button>
        </div>
        {rating > 0 && (
          <div className="absolute top-2 left-2 bg-black/50 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
            ★ {rating.toFixed(1)}
          </div>
        )}
        {video.localPath && (
          <div className="absolute bottom-2 left-2 bg-primary/90 text-white px-2 py-1 rounded-md text-xs font-medium">
            Local
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div>
          <CardTitle
            className="text-sm cursor-pointer hover:text-primary line-clamp-1 mb-1 text-foreground/90"
            onClick={onClick}
          >
            {title}
          </CardTitle>
          <CardDescription className="text-foreground/75">
            <div className="flex flex-wrap gap-1 mb-1">
              {year && (
                <span className="text-xs">
                  {year}
                </span>
              )}
              {video.localPath && video.streamDetails?.video && (
                <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 rounded">
                  {video.streamDetails.video.width}p
                </span>
              )}
            </div>
            {!video.localPath && (
              <div className="flex flex-wrap gap-1">
                {video.genre_ids?.map(genreId => (
                  <span
                    key={genreId}
                    className="inline-block px-1.5 py-0.5 bg-primary/15 text-primary rounded-full text-xs font-medium hover:bg-primary/25 transition-colors"
                  >
                    {genres[genreId]}
                  </span>
                ))}
              </div>
            )}
            {video.localPath && video.genres && (
              <div className="flex flex-wrap gap-1">
                {video.genres.map(genre => (
                  <span
                    key={genre}
                    className="inline-block px-1.5 py-0.5 bg-primary/15 text-primary rounded-full text-xs font-medium hover:bg-primary/25 transition-colors"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  )
}

export default VideoCard
