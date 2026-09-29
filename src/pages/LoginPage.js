/**
 * Login screen (username + password).
 * On success the user is sent back to the page they originally requested.
 */
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import MovieRoundedIcon from '@mui/icons-material/MovieRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ColorModeContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Sign in – Movie Explorer';
  }, []);

  if (isAuthenticated && !submitting) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
      }}
    >
      {/* Brand panel (hidden on phones to keep the form above the fold) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 6,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 20% 20%, #ff6b3d 0%, transparent 45%), radial-gradient(circle at 80% 70%, #7a2cff 0%, transparent 50%), #0e0f13',
          // Film-strip perforations along the left edge.
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 24,
            width: 18,
            backgroundImage: `repeating-linear-gradient(180deg, ${alpha('#fff', 0.18)} 0 14px, transparent 14px 32px)`,
            borderRadius: 1,
          },
        }}
      >
        <Typography variant="h2" component="p" sx={{ fontSize: '3.2rem', lineHeight: 1.05, maxWidth: 520 }}>
          Every story starts with a search.
        </Typography>
        <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 440 }}>
          Discover trending films, dig into cast and trailers, and keep a list of the movies you love.
        </Typography>
      </Box>

      {/* Form panel */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, sm: 4 }, position: 'relative' }}>
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton onClick={toggleColorMode} aria-label="Toggle light/dark mode" sx={{ position: 'absolute', top: 16, right: 16 }}>
            {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
        </Tooltip>

        <Paper
          component="form"
          onSubmit={handleSubmit}
          noValidate
          elevation={0}
          sx={{ width: '100%', maxWidth: 400, p: { xs: 3, sm: 4 }, border: 1, borderColor: 'divider', borderRadius: 4 }}
        >
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MovieRoundedIcon color="primary" sx={{ fontSize: 34 }} />
              <Typography variant="h5" component="span" fontWeight={800}>
                Movie<Box component="span" sx={{ color: 'primary.main' }}>Explorer</Box>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h5" component="h1">
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue exploring.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" role="alert">
                {error}
              </Alert>
            )}

            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              fullWidth
              inputProps={{ autoCapitalize: 'none', spellCheck: false }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ py: 1.4 }}>
              {submitting ? <CircularProgress size={24} color="inherit" aria-label="Signing in" /> : 'Sign in'}
            </Button>

            <Typography variant="caption" color="text.secondary" textAlign="center">
              Demo app: use any username (3+ characters) and password (6+ characters).
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
