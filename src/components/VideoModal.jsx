import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Heart, Clock, Star, Play, X, Film, Maximize2, Volume2, VolumeX } from "lucide-react"
import { useSearch } from '../contexts/SearchContext'
import { useLocalVideos } from '../contexts/LocalVideoContext'
import { useState, useRef, useEffect } from 'react'

/**
 * VideoModal component displays detailed information about a video in a modal dialog
 * @param {Object} props
 * @param {Object} props.video - Video data to display
 * @param {Function} props.onClose - Function to call when the modal is closed
 */
function VideoModal({ video, onClose }) {
  const { favorites, toggleFavorite, watchlist, toggleWatchlist } = useSearch() 
  
  const isFavorite = favorites.has(video.id)
  const isInWatchlist = watchlist.has(video.id)

  return (
    <Dialog open onOpenChange={onClose} aria-labelledby="video-modal-title">
      <DialogContent className="max-w-4xl" aria-describedby="video-modal-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
          <DialogTitle className="text-2xl" id="video-modal-title">{video.title}</DialogTitle>
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close dialog</span>
            </Button>
          </DialogClose>
          </div>
        </DialogHeader>
        <div className={`grid grid-cols-1 ${video.localPath ? '' : 'md:grid-cols-2'} gap-6`}>
          <div>
            <img 
              src={video.poster}
              alt={video.title} 
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          {video.localPath && video.videoPath && (
            <VideoPlayer video={video} />
          )}
          
          <div className="space-y-4" id="video-modal-description">
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleFavorite(video.id)}
                className={isFavorite ? "bg-primary/10" : ""}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Heart 
                  className="mr-2 h-4 w-4" aria-hidden="true"
                  fill={isFavorite ? "currentColor" : "none"} 
                />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toggleWatchlist(video.id)}
                className={isInWatchlist ? "bg-primary/10" : ""}
                aria-pressed={isInWatchlist}
                aria-label={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                <Clock 
                  className="mr-2 h-4 w-4" aria-hidden="true"
                  fill={isInWatchlist ? "currentColor" : "none"} 
                />
                {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </Button>
            </div>

            {video.rating && (
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                <span className="text-lg font-bold">{video.rating}</span>
              </div>
            )}

            {video.trailer && !video.localPath && (
              <div>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => window.open(video.trailer, '_blank')}
                  aria-label="Watch trailer on external site"
                >
                  <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                  Watch Trailer
                </Button>
              </div>
            )}

            {video.localPath && video.videoPath && (
              <div>
                <Button 
                  variant="default"
                  onClick={() => window.api.openFileLocation(video.videoPath)}
                  aria-label="Open file location in file explorer"
                >
                  <Film className="mr-2 h-4 w-4" aria-hidden="true" />
                  Open File Location
                </Button>
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

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * VideoPlayer component for playing local video files
 * @param {Object} props
 * @param {Object} props.video - Video data containing the video path
 * @returns {JSX.Element} Video player component
 */
function VideoPlayer({ video }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true)
        // Get the video file URL from Electron
        const url = await window.api.getVideoFileUrl(video.videoPath)
        setVideoUrl(url)
        setError(null)
      } catch (err) {
        console.error('Error loading video:', err)
        setError('Failed to load video file')
      } finally {
        setIsLoading(false)
      }
    }

    if (video && video.videoPath) {
      loadVideo()
    }
  }, [video])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }
  }

  return (
    <div className="w-full rounded-lg overflow-hidden bg-black">
      {isLoading ? (
        <div className="aspect-video flex items-center justify-center bg-black/90">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" role="status" aria-label="Loading video"></div>
        </div>
      ) : error ? (
        <div className="aspect-video flex items-center justify-center bg-black/90 text-destructive">
          {error}
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full aspect-video"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata} 
            aria-label={`Video player for ${video.title}`}
            controls
          />
          <div className="p-2 bg-black/90 text-white flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFullscreen} 
              className="text-white hover:text-white/80"
              aria-label="Toggle fullscreen"
            >
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </Button>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMute} 
                className="text-white hover:text-white/80"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
              </Button>
              <input
                value={volume}
                onChange={handleVolumeChange}
                className="w-20"
                type="range"
                min="0"
                max="1"
                step="0.01"
                aria-label="Volume"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoModal
