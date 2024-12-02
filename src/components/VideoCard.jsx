import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Heart, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { useSearch } from '../contexts/SearchContext'

function VideoCard({ video, onClick }) {
  const { favorites, toggleFavorite, watchlist, toggleWatchlist } = useSearch()

  const isFavorite = favorites.has(video.id)
  const isInWatchlist = watchlist.has(video.id)

  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <img 
          src={video.poster} 
          alt={video.title} 
          className="w-full h-64 object-cover cursor-pointer transition-transform group-hover:scale-105"
          onClick={onClick}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`bg-black/50 hover:bg-black/70 text-white rounded-full ${isFavorite ? 'text-red-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(video.id)
            }}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`bg-black/50 hover:bg-black/70 text-white rounded-full ${isInWatchlist ? 'text-blue-500' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              toggleWatchlist(video.id)
            }}
          >
            <Clock className="h-4 w-4" fill={isInWatchlist ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle 
              className="text-lg cursor-pointer hover:text-primary"
              onClick={onClick}
            >
              {video.title}
            </CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-1 mt-1">
                {video.genres?.map((genre, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <div className="mt-1">
                <span>{video.year}</span>
                {video.runtime && <span> • {Math.floor(video.runtime / 60)}h {video.runtime % 60}m</span>}
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export default VideoCard
