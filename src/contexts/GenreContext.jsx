import { createContext, useContext, useState, useEffect } from 'react'
import { getMovieGenres } from '../lib/tmdb.api'

const GenreContext = createContext({})

/**
 * Provider component that fetches and manages movie genres
 */
export function GenreProvider({ children }) {
  const [genres, setGenres] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { genres: genreList } = await getMovieGenres()
        // Convert array to map for easier lookup
        const genreMap = Object.fromEntries(
          genreList.map(genre => [genre.id, genre.name])
        )
        setGenres(genreMap)
      } catch (err) {
        console.error('Failed to fetch genres:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGenres()
  }, [])

  return (
    <GenreContext.Provider value={{ genres, isLoading, error }}>
      {children}
    </GenreContext.Provider>
  )
}

/**
 * Hook to access the genre context
 * @returns {Object} Genre context value
 */
export function useGenres() {
  const context = useContext(GenreContext)
  if (context === undefined) {
    throw new Error('useGenres must be used within a GenreProvider')
  }
  return context
}
