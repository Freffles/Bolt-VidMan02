import { createContext, useContext, useState, useCallback } from 'react'
import { loadLocalMovies, clearMovieCache } from '../lib/localData'

const LocalVideoContext = createContext()

export function LocalVideoProvider({ children }) {
  const [localVideos, setLocalVideos] = useState([])
  const [videoFolder, setVideoFolder] = useState(localStorage.getItem('videoFolder'))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const selectVideoFolder = useCallback(async () => {
    try {
      const folderPath = await window.api.selectDirectory()
      if (folderPath) {
        setVideoFolder(folderPath)
        localStorage.setItem('videoFolder', folderPath)
        await loadVideosFromFolder(folderPath)
      }
    } catch (error) {
      console.error('Error selecting video folder:', error)
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

  // Load videos on initial mount if folder is set
  useState(() => {
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
