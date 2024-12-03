/**
 * TMDB API Service
 * Provides functions to interact with The Movie Database API
 */

import { getTMDBUrl } from './tmdb.config';

/**
 * Get a list of popular movies
 * @param {number} page - Page number to fetch
 * @returns {Promise<Object>} Response with movie results and pagination info
 */
export async function getPopularMovies(page = 1) {
  const url = getTMDBUrl('/movie/popular', { page })
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch popular movies')
  return response.json()
}

/**
 * Search for movies by query
 * @param {string} query - Search query
 * @param {number} page - Page number to fetch
 * @returns {Promise<Object>} Response with movie results and pagination info
 */
export async function searchMovies(query, page = 1) {
  const url = getTMDBUrl('/search/movie', { query, page })
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to search movies')
  return response.json()
}

/**
 * Get movie details by ID
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie details
 */
export async function getMovieDetails(movieId) {
  const url = getTMDBUrl(`/movie/${movieId}`)
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch movie details')
  return response.json()
}

/**
 * Get movie videos (trailers, teasers, etc.)
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie videos
 */
export async function getMovieVideos(movieId) {
  const url = getTMDBUrl(`/movie/${movieId}/videos`)
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch movie videos')
  return response.json()
}

/**
 * Get similar movies
 * @param {number} movieId - Movie ID
 * @param {number} page - Page number to fetch
 * @returns {Promise<Object>} Similar movies with pagination info
 */
export async function getSimilarMovies(movieId, page = 1) {
  const url = getTMDBUrl(`/movie/${movieId}/similar`, { page })
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch similar movies')
  return response.json()
}

/**
 * Get movie recommendations
 * @param {number} movieId - Movie ID
 * @param {number} page - Page number to fetch
 * @returns {Promise<Object>} Movie recommendations with pagination info
 */
export async function getMovieRecommendations(movieId, page = 1) {
  const url = getTMDBUrl(`/movie/${movieId}/recommendations`, { page })
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch movie recommendations')
  return response.json()
}

/**
 * Get list of movie genres
 * @returns {Promise<Object>} List of movie genres
 */
export async function getMovieGenres() {
  const url = getTMDBUrl('/genre/movie/list')
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch movie genres')
  return response.json()
}

/**
 * Discover movies by genre
 * @param {number} genreId - Genre ID to filter by
 * @param {number} page - Page number to fetch
 * @returns {Promise<Object>} Movies filtered by genre with pagination info
 */
export async function discoverMoviesByGenre(genreId, page = 1) {
  const url = getTMDBUrl('/discover/movie', { 
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc'
  })
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to discover movies by genre')
  return response.json()
}
