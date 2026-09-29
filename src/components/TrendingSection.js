/** "Trending" carousel with a Today / This week toggle. */
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import { useMovies } from '../context/MovieContext';
import MovieRow from './MovieRow';
import { ErrorMessage } from './StatusMessages';

export default function TrendingSection() {
  const { trending, trendingWindow, setTrendingWindow, retryTrending } = useMovies();

  return (
    <Box component="section" aria-labelledby="trending-heading">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography id="trending-heading" variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalFireDepartmentRoundedIcon color="primary" /> Trending
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={trendingWindow}
          onChange={(_, v) => v && setTrendingWindow(v)}
          aria-label="Trending time window"
        >
          <ToggleButton value="day" sx={{ px: 1.5 }}>
            Today
          </ToggleButton>
          <ToggleButton value="week" sx={{ px: 1.5 }}>
            This week
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {trending.status === 'error' ? (
        <ErrorMessage title="Couldn't load trending movies" message={trending.error} onRetry={retryTrending} />
      ) : (
        <MovieRow label="Trending movies" movies={trending.items} loading={trending.status === 'loading' || trending.status === 'idle'} />
      )}
    </Box>
  );
}
