import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { loadLocalMovies, clearMovieCache } from '../lib/localData'

const LocalVideoContext = createContext()

export function LocalVideoProvider({ children }) {
  const [localVideos, setLocalVideos] = useState([])
  const [videoFolder, setVideoFolder] = useState(localStorage.getItem('videoFolder'))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentVideo, setCurrentVideo] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectVideoFolder = useCallback(async () => {
    try {
      console.log('selectVideoFolder called')
      console.log('window.api available:', !!window.api)
      
      const folderPath = await window.api.selectDirectory()
      console.log('Selected folder path:', folderPath)
      
      if (folderPath) {
        setVideoFolder(folderPath)
        localStorage.setItem('videoFolder', folderPath)
        await loadVideosFromFolder(folderPath)
      }
    } catch (error) {
      console.error('Error selecting video folder:', error.message, error.stack)
      setError('Failed to select video folder')
    }
  }, [])

  const loadVideosFromFolder = useCallback(async (folderPath) => {
    setIsLoading(true)
    setError(null)
    try {
      const movies = await loadLocalMovies(folderPath, true)
      setLocalVideos(movies)
    } catch (error) {
      console.error('Error loading videos:', error)
      setError('Failed to load videos from folder')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshVideos = useCallback(async () => {
    if (videoFolder) {
      clearMovieCache()
      await loadVideosFromFolder(videoFolder)
    }
  }, [videoFolder, loadVideosFromFolder])

  const playVideo = useCallback(async (video) => {
    try {
      if (video && video.localPath) {
        // Get the actual video file path from the local video data
        const videoFilePath = video.videoPath || video.localPath
        
        // Set the current video for playback
        setCurrentVideo({
          ...video,
          videoFilePath
        })
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error playing video:', error)
      setError('Failed to play video')
    }
  }, [])

  const stopVideo = useCallback(() => {
    setCurrentVideo(null)
    setIsPlaying(false)
  }, [])

  // Load videos on initial mount if folder is set
  useEffect(() => {
    if (videoFolder) {
      loadVideosFromFolder(videoFolder)
    }
  }, [])

  const value = {
    localVideos,
    videoFolder,
    isLoading,
    error,
    selectVideoFolder,
    refreshVideos,
    // Video playback
    currentVideo,
    isPlaying,
    playVideo,
    stopVideo,
  }

  return (
    <LocalVideoContext.Provider value={value}>
      {children}
    </LocalVideoContext.Provider>
  )
}

export function useLocalVideos() {
  const context = useContext(LocalVideoContext)
  if (context === undefined) {
    throw new Error('useLocalVideos must be used within a LocalVideoProvider')
  }
  return context
}
