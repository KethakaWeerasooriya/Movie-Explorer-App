/**
 * Authentication context.
 *
 * NOTE: This project has no backend, so login is simulated on the client:
 * any username (3+ chars) and password (6+ chars) is accepted and a session
 * object is stored in localStorage. The password itself is never stored.
 * Swap `login` for a real API call when a backend becomes available.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { readJSON, writeJSON, removeKey, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

/** Validates credentials and returns an error message, or null when valid. */
export function validateCredentials(username, password) {
  if (!username.trim()) return 'Please enter your username.';
  if (username.trim().length < 3) return 'Username must be at least 3 characters.';
  if (!/^[a-zA-Z0-9_.-]+$/.test(username.trim())) {
    return 'Username can only contain letters, numbers, dots, dashes and underscores.';
  }
  if (!password) return 'Please enter your password.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(STORAGE_KEYS.session, null));

  const login = useCallback(async (username, password) => {
    const error = validateCredentials(username, password);
    if (error) throw new Error(error);

    // Simulate network latency so the UI's loading state is exercised.
    await new Promise((resolve) => setTimeout(resolve, 600));

    const session = { username: username.trim(), loggedInAt: new Date().toISOString() };
    writeJSON(STORAGE_KEYS.session, session);
    setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    removeKey(STORAGE_KEYS.session);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
