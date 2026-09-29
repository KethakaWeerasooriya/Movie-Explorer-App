/**
 * Light / dark mode.
 * The initial mode comes from the user's saved preference, falling back to
 * the operating-system preference. The choice is persisted in localStorage.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { buildTheme } from '../theme';
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage';

const ColorModeContext = createContext({ mode: 'dark', toggleColorMode: () => {} });

function getInitialMode() {
  const saved = readJSON(STORAGE_KEYS.colorMode, null);
  if (saved === 'light' || saved === 'dark') return saved;
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    writeJSON(STORAGE_KEYS.colorMode, mode);
  }, [mode]);

  const value = useMemo(
    () => ({ mode, toggleColorMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')) }),
    [mode]
  );
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext);
