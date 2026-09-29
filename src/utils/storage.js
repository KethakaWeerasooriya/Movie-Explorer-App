/**
 * Small, defensive wrappers around localStorage.
 * localStorage can throw (private mode, quota exceeded, corrupted JSON),
 * so every access is guarded and falls back to a default value.
 */
export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors - persistence is a nice-to-have, not critical.
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Centralised storage keys so they are easy to find and never collide. */
export const STORAGE_KEYS = {
  session: 'mx:session',
  colorMode: 'mx:color-mode',
  lastSearch: 'mx:last-search',
  scrollMode: 'mx:scroll-mode',
  // Favourites are stored per user so different logins keep separate lists.
  favorites: (username) => `mx:favorites:${username}`,
};
