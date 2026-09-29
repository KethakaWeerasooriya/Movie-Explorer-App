/**
 * MUI theme factory. A single function builds both the light and dark
 * palettes so the two modes stay visually consistent.
 */
import { createTheme, alpha } from '@mui/material/styles';

const ACCENT = '#ff6b3d'; // warm "projector" orange
const GOLD = '#ffc857'; // rating stars

export function buildTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? ACCENT : '#e0501f', contrastText: '#fff' },
      secondary: { main: GOLD },
      background: {
        default: isDark ? '#0e0f13' : '#f6f4f1',
        paper: isDark ? '#171920' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f2f2f4' : '#1a1b20',
        secondary: isDark ? '#a2a5b1' : '#5d6070',
      },
      divider: isDark ? alpha('#ffffff', 0.08) : alpha('#000000', 0.08),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h1: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700, letterSpacing: '-0.01em' },
      h4: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700 },
      h5: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700 },
      h6: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { WebkitFontSmoothing: 'antialiased' },
          // Slim scrollbars for the horizontal carousels.
          '*::-webkit-scrollbar': { height: 8, width: 8 },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: isDark ? alpha('#fff', 0.15) : alpha('#000', 0.15),
            borderRadius: 8,
          },
        },
      },
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiCard: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: alpha(isDark ? '#0e0f13' : '#f6f4f1', 0.8),
            backdropFilter: 'blur(12px)',
            color: isDark ? '#f2f2f4' : '#1a1b20',
          },
        },
      },
    },
  });
}
