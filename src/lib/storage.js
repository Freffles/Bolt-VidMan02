const STORAGE_KEYS = {
  FAVORITES: 'vidman_favorites',
  WATCHLIST: 'vidman_watchlist',
  VIDEOS: 'vidman_videos',
  CACHE: 'vidman_cache',
}

const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error saving to storage:', error)
    return false
  }
}

export function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error reading from storage:', error)
    return null
  }
}

export function cacheResponse(key, data) {
  const cacheData = {
    timestamp: Date.now(),
    data,
  }
  saveToStorage(`${STORAGE_KEYS.CACHE}_${key}`, cacheData)
}

export function getCachedResponse(key) {
  const cacheData = getFromStorage(`${STORAGE_KEYS.CACHE}_${key}`)
  if (!cacheData) return null

  const isExpired = Date.now() - cacheData.timestamp > CACHE_EXPIRY
  return isExpired ? null : cacheData.data
}

export function exportUserData() {
  const data = {
    favorites: getFromStorage(STORAGE_KEYS.FAVORITES) || [],
    watchlist: getFromStorage(STORAGE_KEYS.WATCHLIST) || [],
    videos: getFromStorage(STORAGE_KEYS.VIDEOS) || [],
    version: '1.0',
    exportDate: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `vidman_data_${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importUserData(file) {
  try {
    const text = await file.text()
    const data = JSON.parse(text)

    // Validate data structure
    if (!data.version || !data.favorites || !data.watchlist || !data.videos) {
      throw new Error('Invalid data format')
    }

    // Import data
    saveToStorage(STORAGE_KEYS.FAVORITES, data.favorites)
    saveToStorage(STORAGE_KEYS.WATCHLIST, data.watchlist)
    saveToStorage(STORAGE_KEYS.VIDEOS, data.videos)

    return true
  } catch (error) {
    console.error('Error importing data:', error)
    return false
  }
}

export { STORAGE_KEYS }
