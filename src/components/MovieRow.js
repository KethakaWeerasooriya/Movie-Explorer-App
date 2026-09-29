/**
 * Horizontally scrolling row of movie cards (used for Trending and
 * "More like this"). Uses CSS scroll-snap for a native feel on touch devices,
 * with arrow buttons on larger screens.
 */
import { useRef } from 'react';
import { Box, IconButton } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import MovieCard from './MovieCard';
import { MovieCardSkeleton } from './MovieGrid';

const ITEM_WIDTH = { xs: 136, sm: 170, md: 185 };

export default function MovieRow({ movies = [], loading = false, label }) {
  const scrollerRef = useRef(null);

  const scrollBy = (direction) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  const arrowSx = {
    display: { xs: 'none', md: 'inline-flex' },
    position: 'absolute',
    top: '38%',
    zIndex: 2,
    bgcolor: 'background.paper',
    boxShadow: 3,
    '&:hover': { bgcolor: 'background.paper' },
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton aria-label={`Scroll ${label} left`} onClick={() => scrollBy(-1)} sx={{ ...arrowSx, left: -18 }}>
        <ChevronLeftRoundedIcon />
      </IconButton>

      <Box
        ref={scrollerRef}
        role="list"
        aria-label={label}
        sx={{
          display: 'flex',
          gap: { xs: 1.5, sm: 2 },
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          pb: 1.5,
          // Let the row bleed to the screen edge on mobile.
          mx: { xs: -2, sm: 0 },
          px: { xs: 2, sm: 0 },
          scrollPaddingLeft: { xs: 16, sm: 0 },
        }}
      >
        {(loading ? Array.from({ length: 8 }, (_, i) => ({ id: `sk-${i}` })) : movies).map((movie) => (
          <Box key={movie.id} role="listitem" sx={{ flex: '0 0 auto', width: ITEM_WIDTH, scrollSnapAlign: 'start' }}>
            {loading ? <MovieCardSkeleton /> : <MovieCard movie={movie} />}
          </Box>
        ))}
      </Box>

      <IconButton aria-label={`Scroll ${label} right`} onClick={() => scrollBy(1)} sx={{ ...arrowSx, right: -18 }}>
        <ChevronRightRoundedIcon />
      </IconButton>
    </Box>
  );
}
