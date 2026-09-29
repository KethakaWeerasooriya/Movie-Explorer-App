/**
 * Movie data context (React Context API + useReducer).
 *
 * Owns everything the Home page needs:
 *  - the current search query (persisted to localStorage as the "last search")
 *  - filters (genre / year / minimum rating)
 *  - paginated results for search or discover, with "load more" support
 *  - trending movies and the genre list
 *
 * Components read state and call actions through `useMovies()`, keeping
 * all fetching and error handling out of the UI layer.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { discoverMovies, getGenres, getTrending, searchMovies, toFriendlyError } from '../api/tmdb';
import { readJSON, writeJSON, removeKey, STORAGE_KEYS } from '../utils/storage';

const MovieContext = createContext(null);

// TMDb refuses to serve pages beyond 500.
const MAX_PAGES = 500;

export const EMPTY_FILTERS = { genre: '', year: '', minRating: '' };

const initialResults = { items: [], page: 0, totalPages: 0, totalResults: 0, status: 'idle', error: null };

function resultsReducer(state, action) {
  switch (action.type) {
    case 'reset':
      return { ...initialResults, status: 'loading' };
    case 'loadMore':
      return { ...state, status: 'loadingMore', error: null };
    case 'success': {
      // TMDb pagination can repeat a movie across pages - de-duplicate by id.
      const seen = new Set(action.append ? state.items.map((m) => m.id) : []);
      const fresh = action.items.filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
      return {
        items: action.append ? [...state.items, ...fresh] : fresh,
        page: action.page,
        totalPages: action.totalPages,
        totalResults: action.totalResults,
        status: 'success',
        error: null,
      };
    }
    case 'error':
      return { ...state, status: 'error', error: action.error };
    default:
      return state;
  }
}

/**
 * TMDb's search endpoint only supports filtering by year, so genre and
 * rating filters are applied client-side to search results.
 */
function applyClientFilters(movies, { genre, minRating }) {
  return movies.filter(
    (m) =>
      (!genre || (m.genre_ids || []).includes(Number(genre))) &&
      (!minRating || (m.vote_average || 0) >= Number(minRating))
  );
}

export function MovieProvider({ children }) {
  // Restore the last search so it survives page reloads.
  const [query, setQueryState] = useState(() => readJSON(STORAGE_KEYS.lastSearch, ''));
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [results, dispatch] = useReducer(resultsReducer, initialResults);

  const [trendingWindow, setTrendingWindow] = useState('week');
  const [trending, setTrending] = useState({ items: [], status: 'idle', error: null });
  const [genres, setGenres] = useState([]);

  // Holds the AbortController of the in-flight results request so stale
  // responses (e.g. from a previous query) can never overwrite newer ones.
  const controllerRef = useRef(null);

  const setQuery = useCallback((value) => {
    const trimmed = value.trim();
    setQueryState(trimmed);
    if (trimmed) writeJSON(STORAGE_KEYS.lastSearch, trimmed);
    else removeKey(STORAGE_KEYS.lastSearch);
  }, []);

  const fetchPage = useCallback(
    async (page, append) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      dispatch({ type: append ? 'loadMore' : 'reset' });

      try {
        const data = query
          ? await searchMovies(query, page, { year: filters.year, signal: controller.signal })
          : await discoverMovies({ ...filters, page }, { signal: controller.signal });

        dispatch({
          type: 'success',
          append,
          items: query ? applyClientFilters(data.results, filters) : data.results,
          page: data.page,
          totalPages: Math.min(data.total_pages, MAX_PAGES),
          totalResults: data.total_results,
        });
      } catch (err) {
        const message = toFriendlyError(err);
        if (message) dispatch({ type: 'error', error: message }); // null => request was cancelled
      }
    },
    [query, filters]
  );

  // Refetch page 1 whenever the query or filters change.
  // (fetchPage itself aborts any previous in-flight request.)
  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const hasMore = results.page > 0 && results.page < results.totalPages;
  const isBusy = results.status === 'loading' || results.status === 'loadingMore';

  const loadMore = useCallback(() => {
    if (hasMore && !isBusy) fetchPage(results.page + 1, true);
  }, [hasMore, isBusy, fetchPage, results.page]);

  /** Retries whatever failed last: the first page, or the next page. */
  const retry = useCallback(() => {
    if (results.items.length === 0) fetchPage(1, false);
    else fetchPage(results.page + 1, true);
  }, [fetchPage, results.items.length, results.page]);

  // Trending movies (re-fetched when the day/week toggle changes).
  const loadTrending = useCallback(async (signal) => {
    setTrending((t) => ({ ...t, status: 'loading', error: null }));
    try {
      const data = await getTrending(trendingWindow, { signal });
      setTrending({ items: data.results, status: 'success', error: null });
    } catch (err) {
      const message = toFriendlyError(err);
      if (message) setTrending({ items: [], status: 'error', error: message });
    }
  }, [trendingWindow]);

  useEffect(() => {
    const controller = new AbortController();
    loadTrending(controller.signal);
    return () => controller.abort();
  }, [loadTrending]);

  // Genre list for the filter bar (fetched once; failure just hides the options).
  useEffect(() => {
    const controller = new AbortController();
    getGenres({ signal: controller.signal })
      .then(setGenres)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      filters,
      setFilters,
      resetFilters: () => setFilters(EMPTY_FILTERS),
      results,
      hasMore,
      loadMore,
      retry,
      trending,
      trendingWindow,
      setTrendingWindow,
      retryTrending: () => loadTrending(),
      genres,
    }),
    [query, setQuery, filters, results, hasMore, loadMore, retry, trending, trendingWindow, loadTrending, genres]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovies() {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovies must be used inside <MovieProvider>');
  return ctx;
}
