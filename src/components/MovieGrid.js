/**
 * Responsive poster grid. Mobile-first: two columns on small phones,
 * growing automatically with the available width.
 * Shows skeleton tiles while the first page is loading.
 */
import { Box, Skeleton } from '@mui/material';
import MovieCard from './MovieCard';

const gridSx = {
  display: 'grid',
  gap: { xs: 1.5, sm: 2.5 },
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(auto-fill, minmax(160px, 1fr))',
    lg: 'repeat(auto-fill, minmax(185px, 1fr))',
  },
};

export function MovieCardSkeleton() {
  return (
    <Box>
      <Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto', borderRadius: 3 }} />
      <Skeleton width="80%" sx={{ mt: 1 }} />
      <Skeleton width="30%" />
    </Box>
  );
}

export default function MovieGrid({ movies = [], loading = false, skeletonCount = 12 }) {
  return (
    <Box sx={gridSx}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      {loading && Array.from({ length: skeletonCount }, (_, i) => <MovieCardSkeleton key={`sk-${i}`} />)}
    </Box>
  );
}
