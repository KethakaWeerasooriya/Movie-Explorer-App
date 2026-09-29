/**
 * Favourite movies, persisted in localStorage per logged-in user.
 * Only the fields needed to render a MovieCard are stored, keeping storage small.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage';

const FavoritesContext = createContext(null);

/** Strip a TMDb movie object down to what the UI needs. */
const toFavorite = (movie) => ({
  id: movie.id,
  title: movie.title,
  poster_path: movie.poster_path,
  release_date: movie.release_date,
  vote_average: movie.vote_average,
  genre_ids: movie.genre_ids || (movie.genres || []).map((g) => g.id),
  addedAt: Date.now(),
});

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user ? STORAGE_KEYS.favorites(user.username) : null;
  const [favorites, setFavorites] = useState([]);

  // Load the list whenever the logged-in user changes.
  useEffect(() => {
    setFavorites(storageKey ? readJSON(storageKey, []) : []);
  }, [storageKey]);

  // Every update writes straight through to localStorage.
  const update = useCallback(
    (updater) => {
      setFavorites((prev) => {
        const next = updater(prev);
        if (storageKey) writeJSON(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const isFavorite = useCallback((id) => favorites.some((m) => m.id === id), [favorites]);

  const toggleFavorite = useCallback(
    (movie) =>
      update((prev) =>
        prev.some((m) => m.id === movie.id) ? prev.filter((m) => m.id !== movie.id) : [toFavorite(movie), ...prev]
      ),
    [update]
  );

  const clearFavorites = useCallback(() => update(() => []), [update]);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, clearFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}
