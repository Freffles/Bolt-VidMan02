/**
 * TMDB API Configuration
 * 
 * To use this API:
 * 1. Sign up at https://www.themoviedb.org/
 * 2. Get your API key from https://www.themoviedb.org/settings/api
 * 3. Create a .env file in the project root
 * 4. Add your API key as: VITE_TMDB_API_KEY=your_api_key_here
 */

const TMDB_CONFIG = {
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  posterSizes: {
    tiny: 'w92',
    small: 'w154',
    medium: 'w342',
    large: 'w500',
    xlarge: 'w780',
    original: 'original'
  },
  backdropSizes: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profileSizes: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original'
  }
}

/**
 * Generate a full TMDB API URL with API key and parameters
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} Full URL
 */
export function getTMDBUrl(endpoint, params = {}) {
  const url = new URL(`${TMDB_CONFIG.baseUrl}${endpoint}`)
  url.searchParams.append('api_key', import.meta.env.VITE_TMDB_API_KEY)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value)
    }
  })

  return url.toString()
}

/**
 * Get the full URL for a TMDB image
 * @param {string} path - Image path from API
 * @param {string} size - Size key (tiny, small, medium, large, xlarge, original)
 * @param {string} type - Image type (poster, backdrop, profile)
 * @returns {string|null} Full image URL or null if path is missing
 */
export function getTMDBImageUrl(path, size = 'medium', type = 'poster') {
  if (!path) return null

  let sizeConfig
  switch (type) {
    case 'poster':
      sizeConfig = TMDB_CONFIG.posterSizes[size]
      break
    case 'backdrop':
      sizeConfig = TMDB_CONFIG.backdropSizes[size]
      break
    case 'profile':
      sizeConfig = TMDB_CONFIG.profileSizes[size]
      break
    default:
      throw new Error(`Invalid image type: ${type}`)
  }

  return `${TMDB_CONFIG.imageBaseUrl}/${sizeConfig}${path}`
}

export default TMDB_CONFIG
