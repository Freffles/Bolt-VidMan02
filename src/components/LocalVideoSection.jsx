import { useLocalVideos } from '../contexts/LocalVideoContext'
import { Button } from './ui/button'
import VideoGrid from './VideoGrid'
import { Loader2, FolderOpen, RefreshCw, HardDrive } from 'lucide-react'
import { useSearch } from '../contexts/SearchContext'

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

  if (!videoFolder) {
    return (
      <div className="rounded-lg border border-dashed border-primary/20 bg-background p-8 space-y-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <HardDrive className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to VidMan</h2>
          <p className="text-muted-foreground max-w-sm mb-4">
            Select a folder containing your video collection to get started. 
            The folder should contain movie subfolders with NFO files.
          </p>
          <Button onClick={selectVideoFolder}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Select Video Folder
          </Button>
        </div>
      </div>
    )
  }

  if (localVideos.length === 0 && !isLoading) {
    return (
      <div className="rounded-lg border border-dashed border-primary/20 bg-background p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <HardDrive className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">No Videos Found</h2>
          <p className="text-muted-foreground max-w-sm mb-4">
            No video files were found in the selected folder. Make sure the folder contains
            movie subfolders with NFO files.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshVideos}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={selectVideoFolder}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Change Folder
            </Button>
          </div>
        </div>
      </div>
    )
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{getSectionTitle()}</h2>
          <p className="text-sm text-muted-foreground mt-1">{videoFolder}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshVideos} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <VideoGrid videos={getFilteredVideos()} />
      )}
    </div>
  )
}
