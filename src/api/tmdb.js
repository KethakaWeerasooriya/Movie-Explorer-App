/**
 * TMDb API client.
 *
 * All network access to The Movie Database goes through this module so that
 * authentication, base URLs and error normalisation live in one place.
 * Docs: https://developer.themoviedb.org/reference/intro/getting-started
 */
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const READ_TOKEN = process.env.REACT_APP_TMDB_READ_TOKEN;

export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

/** True when at least one credential has been configured. */
export const hasCredentials = Boolean(API_KEY || READ_TOKEN);

const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  // Prefer the v4 Bearer token when available, otherwise fall back to the v3 api_key param.
  headers: READ_TOKEN ? { Authorization: `Bearer ${READ_TOKEN}` } : {},
  params: !READ_TOKEN && API_KEY ? { api_key: API_KEY } : {},
});

/**
 * Converts any axios error into a short, user-friendly message so that
 * components never have to inspect raw HTTP errors.
 * Returns null for cancelled requests (those should be ignored silently).
 */
export function toFriendlyError(error) {
  if (axios.isCancel(error)) return null;
  if (!hasCredentials) {
    return 'TMDb API key is missing. Add REACT_APP_TMDB_API_KEY to your .env file and restart the app.';
  }
  if (error.code === 'ECONNABORTED') {
    return 'The request took too long. Please check your connection and try again.';
  }
  if (!error.response) {
    return "Can't reach TMDb right now. Please check your internet connection.";
  }
  switch (error.response.status) {
    case 401:
      return 'Your TMDb API key is invalid. Please check your configuration.';
    case 404:
      return "We couldn't find what you were looking for.";
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    default:
      return 'Something went wrong while talking to TMDb. Please try again later.';
  }
}

/** Builds a full image URL for a TMDb poster/backdrop/profile path. */
export function imageUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

/** Trending movies for the given time window ("day" | "week"). */
export async function getTrending(timeWindow = 'week', { signal } = {}) {
  const { data } = await client.get(`/trending/movie/${timeWindow}`, { signal });
  return data;
}

/** Full-text movie search. `year` is applied server-side by TMDb. */
export async function searchMovies(query, page = 1, { year, signal } = {}) {
  const { data } = await client.get('/search/movie', {
    params: { query, page, include_adult: false, ...(year ? { primary_release_year: year } : {}) },
    signal,
  });
  return data;
}

/**
 * Discover movies using filters (genre, year, minimum rating).
 * Used to browse when the user hasn't typed a search query.
 */
export async function discoverMovies({ genre, year, minRating, page = 1 } = {}, { signal } = {}) {
  const { data } = await client.get('/discover/movie', {
    params: {
      page,
      include_adult: false,
      sort_by: 'popularity.desc',
      ...(genre ? { with_genres: genre } : {}),
      ...(year ? { primary_release_year: year } : {}),
      // Require a minimum number of votes so a single 10/10 vote doesn't dominate.
      ...(minRating ? { 'vote_average.gte': minRating, 'vote_count.gte': 50 } : {}),
    },
    signal,
  });
  return data;
}

/** Movie details, with videos (trailers), credits (cast) and similar titles in one request. */
export async function getMovieDetails(id, { signal } = {}) {
  const { data } = await client.get(`/movie/${id}`, {
    params: { append_to_response: 'videos,credits,similar' },
    signal,
  });
  return data;
}

/** The official list of movie genres, used by the filter bar. */
export async function getGenres({ signal } = {}) {
  const { data } = await client.get('/genre/movie/list', { signal });
  return data.genres;
}
