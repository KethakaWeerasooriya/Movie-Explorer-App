/** Favourites list (stored in localStorage), with sorting and "clear all". */
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import MovieGrid from '../components/MovieGrid';
import { EmptyState } from '../components/StatusMessages';
import { useFavorites } from '../context/FavoritesContext';

const SORTERS = {
  recent: { label: 'Recently added', fn: (a, b) => (b.addedAt || 0) - (a.addedAt || 0) },
  title: { label: 'Title (A–Z)', fn: (a, b) => a.title.localeCompare(b.title) },
  rating: { label: 'Rating', fn: (a, b) => (b.vote_average || 0) - (a.vote_average || 0) },
  year: { label: 'Release date', fn: (a, b) => (b.release_date || '').localeCompare(a.release_date || '') },
};

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [sortBy, setSortBy] = useState('recent');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    document.title = 'Favorites – Movie Explorer';
  }, []);

  const sorted = useMemo(() => [...favorites].sort(SORTERS[sortBy].fn), [favorites, sortBy]);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 5 } }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Your favorites
          </Typography>
          <Typography color="text.secondary">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved on this device
          </Typography>
        </Box>

        {favorites.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel id="sort-favorites">Sort by</InputLabel>
              <Select labelId="sort-favorites" label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {Object.entries(SORTERS).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button color="error" startIcon={<DeleteSweepRoundedIcon />} onClick={() => setConfirmOpen(true)}>
              Clear all
            </Button>
          </Box>
        )}
      </Box>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<FavoriteBorderRoundedIcon />}
          title="No favorites yet"
          description="Tap the heart on any movie to save it here. Your list is stored locally in this browser."
          action={
            <Button variant="contained" component={RouterLink} to="/">
              Explore movies
            </Button>
          }
        />
      ) : (
        <MovieGrid movies={sorted} />
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Clear all favorites?</DialogTitle>
        <DialogContent>
          <DialogContentText>This removes all {favorites.length} saved movies. This can't be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              clearFavorites();
              setConfirmOpen(false);
            }}
          >
            Clear all
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
