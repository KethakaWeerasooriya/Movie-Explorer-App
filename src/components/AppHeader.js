/**
 * Top navigation bar: logo, Home / Favorites links, theme toggle and user menu.
 * On phones the nav links collapse to icons to save space.
 */
import { useState } from 'react';
import { NavLink, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MovieRoundedIcon from '@mui/icons-material/MovieRounded';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ColorModeContext';
import { useFavorites } from '../context/FavoritesContext';

/** Nav button that highlights itself when its route is active. */
function NavButton({ to, icon, label, end }) {
  return (
    <Button
      component={NavLink}
      to={to}
      end={end}
      color="inherit"
      aria-label={label}
      sx={{
        minWidth: 0,
        px: { xs: 1, sm: 1.75 },
        borderRadius: 999,
        color: 'text.secondary',
        '&.active': { color: 'text.primary', bgcolor: 'action.selected' },
      }}
    >
      {icon}
      <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 1 }}>
        {label}
      </Box>
    </Button>
  );
}

export default function AppHeader() {
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleLogout = () => {
    setMenuAnchor(null);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: { xs: 0.5, sm: 1 } }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none', mr: 'auto' }}
          >
            <MovieRoundedIcon color="primary" sx={{ fontSize: 30 }} />
            <Typography variant="h6" component="span" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Movie<Box component="span" sx={{ color: 'primary.main' }}>Explorer</Box>
            </Typography>
          </Box>

          <Box component="nav" aria-label="Main" sx={{ display: 'flex', gap: 0.5 }}>
            <NavButton to="/" end icon={<HomeRoundedIcon />} label="Home" />
            <NavButton
              to="/favorites"
              label="Favorites"
              icon={
                <Badge badgeContent={favorites.length} color="primary" max={99}>
                  <FavoriteRoundedIcon />
                </Badge>
              }
            />
          </Box>

          <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={toggleColorMode} aria-label="Toggle light/dark mode">
              {mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} aria-label="Account menu" sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 15, fontWeight: 700 }}>
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Signed in as
              </Typography>
              <Typography fontWeight={700}>{user?.username}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
              Log out
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
