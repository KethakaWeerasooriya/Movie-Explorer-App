/**
 * Layout for all signed-in pages. It also acts as the route guard:
 * unauthenticated visitors are redirected to /login (remembering where they
 * were headed). The movie/favourites providers live here so data is only
 * fetched once a user is signed in, and is kept while navigating between pages.
 */
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, Container, Link, Typography } from '@mui/material';
import AppHeader from './AppHeader';
import { useAuth } from '../context/AuthContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { MovieProvider } from '../context/MovieContext';

/** Scroll to the top whenever the route changes (e.g. opening a movie). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <FavoritesProvider>
      <MovieProvider>
        <ScrollToTop />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppHeader />
          <Box component="main" sx={{ flex: 1 }}>
            <Outlet />
          </Box>
          <Container maxWidth="xl" component="footer" sx={{ py: 4 }}>
            <Typography variant="caption" color="text.secondary" component="p" textAlign="center">
              This product uses the TMDb API but is not endorsed or certified by TMDb. Data &amp; images ©{' '}
              <Link href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" color="inherit">
                The Movie Database
              </Link>
              .
            </Typography>
          </Container>
        </Box>
      </MovieProvider>
    </FavoritesProvider>
  );
}
