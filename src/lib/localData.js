// XML parser for browser
const parser = new DOMParser()

export function parseNfoFile(xmlContent) {
  const doc = parser.parseFromString(xmlContent, 'text/xml')
  
  // Helper function to safely get text content
  const getElementText = (elementName) => {
    const element = doc.querySelector(elementName)
    return element ? element.textContent : ''
  }

  // Helper function to get multiple elements
  const getElements = (elementName) => {
    return Array.from(doc.querySelectorAll(elementName))
  }

  // Parse actors
  const actors = getElements('actor').map(actor => ({
    name: actor.querySelector('name')?.textContent || '',
    role: actor.querySelector('role')?.textContent || '',
    thumb: actor.querySelector('thumb')?.textContent || ''
  }))

  // Parse genres
  const genres = getElements('genre').map(genre => genre.textContent)

  // Parse stream details
  const video = doc.querySelector('streamdetails > video')
  const audio = doc.querySelector('streamdetails > audio')

  return {
    title: getElementText('title'),
    rating: parseFloat(getElementText('rating')) || 0,
    year: parseInt(getElementText('year')) || null,
    outline: getElementText('outline'),
    plot: getElementText('plot'),
    tagline: getElementText('tagline'),
    runtime: parseInt(getElementText('runtime')) || 0,
    mpaa: getElementText('mpaa'),
    certification: getElementText('certification'),
    id: getElementText('id'),
    tmdbId: getElementText('tmdbId'),
    country: getElementText('country'),
    premiered: getElementText('premiered'),
    genres,
    actors,
    director: getElementText('director'),
    streamDetails: {
      video: video ? {
        codec: video.querySelector('codec')?.textContent || '',
        aspect: parseFloat(video.querySelector('aspect')?.textContent) || 0,
        width: parseInt(video.querySelector('width')?.textContent) || 0,
        height: parseInt(video.querySelector('height')?.textContent) || 0
      } : null,
      audio: audio ? {
        codec: audio.querySelector('codec')?.textContent || '',
        language: audio.querySelector('language')?.textContent || '',
        channels: parseInt(audio.querySelector('channels')?.textContent) || 0
      } : null
    },
    watched: getElementText('watched') === 'true'
  }
}

export async function scanVideoFolder(folderPath) {
  try {
    const entries = await window.api.readDirectory(folderPath)
    const movies = []

    for (const entry of entries) {
      if (entry.isDirectory) {
        const movieFolder = entry.name
        const moviePath = `${folderPath}/${movieFolder}`
        
        // Look for NFO file
        const nfoFile = await findNfoFile(moviePath, movieFolder)
        if (!nfoFile) continue

        // Read and parse NFO content
        const nfoContent = await window.api.readFile(nfoFile)
        const movieData = parseNfoFile(nfoContent)

        // Look for poster and fanart
        const posterPath = await findFile(moviePath, 'poster.jpg')
        const fanartPath = await findFile(moviePath, 'fanart.jpg')
        const videoPath = await findVideoFile(moviePath)

        movies.push({
          ...movieData,
          folderPath: moviePath,
          posterPath,
          fanartPath,
          videoPath,
          localPath: true
        })
      }
    }

    return movies
  } catch (error) {
    console.error('Error scanning video folder:', error)
    throw error
  }
}

async function findNfoFile(folderPath, movieName) {
  // First try with movie name
  let nfoPath = `${folderPath}/${movieName}.nfo`
  if (await window.api.fileExists(nfoPath)) {
    return nfoPath
  }

  // Then try movie.nfo
  nfoPath = `${folderPath}/movie.nfo`
  if (await window.api.fileExists(nfoPath)) {
    return nfoPath
  }

  return null
}

async function findVideoFile(folderPath) {
  try {
    // Get all files in the folder
    const entries = await window.api.readDirectory(folderPath)
    
    // Common video file extensions
    const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.m4v', '.webm']
    
    // Find the first file with a video extension
    for (const entry of entries) {
      if (entry.isFile) {
        const ext = entry.name.substring(entry.name.lastIndexOf('.')).toLowerCase()
        if (videoExtensions.includes(ext)) {
          return `${folderPath}/${entry.name}`
        }
      }
    }
    return null
  } catch (error) {
    return null
  }
}

async function findFile(folderPath, fileName) {
  const filePath = `${folderPath}/${fileName}`
  return await window.api.fileExists(filePath) ? filePath : null
}

// Cache for loaded movies
let movieCache = null

export async function loadLocalMovies(folderPath, force = false) {
  if (movieCache && !force) {
    return movieCache
  }

  try {
    const movies = await scanVideoFolder(folderPath)
    movieCache = movies
    return movies
  } catch (error) {
    console.error('Error loading local movies:', error)
    throw error
  }
}

export function clearMovieCache() {
  movieCache = null
}
