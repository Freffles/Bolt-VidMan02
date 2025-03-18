import { useLocalVideos } from '../contexts/LocalVideoContext'
import { Button } from './ui/button'
import VideoGrid from './VideoGrid'
import { Loader2, FolderOpen, RefreshCw, HardDrive } from 'lucide-react'
import { useSearch } from '../contexts/SearchContext'
import { useState } from 'react'
import VideoModal from './VideoModal'

/**
 * LocalVideoSection component for displaying and managing local videos
 * Handles different states: no folder selected, empty folder, and displaying videos
 */
export default function LocalVideoSection() {
  const { 
    localVideos, 
    videoFolder, 
    isLoading, 
    error, 
    selectVideoFolder, 
    refreshVideos 
  } = useLocalVideos()

  const { activeSection } = useSearch()
  
  const [selectedVideo, setSelectedVideo] = useState(null)

  if (!videoFolder) {
    return (
      <section 
        className="rounded-lg border border-dashed border-primary/20 bg-background p-8 space-y-4"
        aria-labelledby="welcome-heading"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <HardDrive className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 id="welcome-heading" className="text-2xl font-bold">Welcome to VidMan</h2>
          <p className="text-muted-foreground max-w-sm mb-4">
            Select a folder containing your video collection to get started. 
            The folder should contain movie subfolders with NFO files.
          </p>
          <Button 
            onClick={() => {
              console.log('Select Video Folder button clicked');
              selectVideoFolder();
            }}
            aria-label="Select video folder to get started"
          >
            <FolderOpen className="mr-2 h-4 w-4" aria-hidden="true" />
            Select Video Folder
          </Button>
        </div>
      </section>
    )
  }

  if (localVideos.length === 0 && !isLoading) {
    return (
      <section 
        className="rounded-lg border border-dashed border-primary/20 bg-background p-8"
        aria-labelledby="no-videos-heading"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <HardDrive className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <h2 id="no-videos-heading" className="text-2xl font-bold">No Videos Found</h2>
          <p className="text-muted-foreground max-w-sm mb-4">
            No video files were found in the selected folder. Make sure the folder contains
            movie subfolders with NFO files.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={refreshVideos}
              aria-label="Refresh video list"
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
            <Button 
              onClick={selectVideoFolder}
              aria-label="Change video folder"
            >
              <FolderOpen className="mr-2 h-4 w-4" aria-hidden="true" />
              Change Folder
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const handleVideoSelect = (video) => {
    // Format the video data for the modal
    const formattedVideo = {
      ...video,
      poster: video.posterUrl || '/placeholder-poster.jpg',
      videoPath: video.videoPath || video.localPath,
      localPath: true
    }
    setSelectedVideo(formattedVideo)
  }

  const getFilteredVideos = () => {
    switch (activeSection) {
      case 'favorites':
        return localVideos.filter(video => video.isFavorite)
      case 'watchlist':
        return localVideos.filter(video => video.isInWatchlist)
      case 'genres':
        // TODO: Implement genre filtering
        return localVideos
      default:
        return localVideos
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'favorites':
        return 'Favorites'
      case 'watchlist':
        return 'Watch Later'
      case 'genres':
        return 'Genres'
      default:
        return 'All Videos'
    }
  }

  return (
    <section className="space-y-4" aria-labelledby="section-title">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="section-title" className="text-2xl font-bold">{getSectionTitle()}</h2>
          <p className="text-sm text-muted-foreground mt-1">{videoFolder}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={refreshVideos} 
            disabled={isLoading}
            aria-label="Refresh videos"
          >
            <RefreshCw 
              className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} 
              aria-hidden="true" 
            />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div 
          className="bg-destructive/10 text-destructive p-4 rounded-lg" 
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {isLoading ? (
        <div 
          className="flex items-center justify-center p-12" 
          role="status"
          aria-label="Loading videos"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <span className="sr-only">Loading videos...</span>
        </div>
      ) : (
        <>
          <VideoGrid videos={getFilteredVideos()} onVideoSelect={handleVideoSelect} />
          {selectedVideo && (
            <VideoModal 
              video={selectedVideo} 
              onClose={() => setSelectedVideo(null)} 
            />
          )}
        </>
      )}
    </section>
  )
}
