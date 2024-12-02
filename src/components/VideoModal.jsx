import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Heart, Clock, Star } from "lucide-react"

function VideoModal({ video, onClose }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{video.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={video.poster} 
              alt={video.title} 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {video.genres?.map((genre, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>{video.year}</span>
              {video.runtime && (
                <>
                  <span>•</span>
                  <span>{Math.floor(video.runtime / 60)}h {video.runtime % 60}m</span>
                </>
              )}
              {video.mpaa && (
                <>
                  <span>•</span>
                  <span>{video.mpaa}</span>
                </>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="mr-2 h-4 w-4" />
                Add to Favorites
              </Button>
              <Button variant="outline" size="sm">
                <Clock className="mr-2 h-4 w-4" />
                Watchlist
              </Button>
            </div>

            {video.rating && (
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold">{video.rating}</span>
              </div>
            )}

            {video.director && (
              <div>
                <h3 className="font-semibold mb-2">Director</h3>
                <p className="text-muted-foreground">{video.director}</p>
              </div>
            )}

            {video.plot && (
              <div>
                <h3 className="font-semibold mb-2">Plot</h3>
                <p className="text-muted-foreground">{video.plot}</p>
              </div>
            )}

            {video.actors && video.actors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Cast</h3>
                <div className="grid grid-cols-2 gap-2">
                  {video.actors.slice(0, 6).map((actor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {actor.thumb && (
                        <img 
                          src={actor.thumb} 
                          alt={actor.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{actor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{actor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VideoModal
