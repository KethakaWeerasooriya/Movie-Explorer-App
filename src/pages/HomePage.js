/**
 * Home page: search bar, trending carousel, filters and the results grid.
 *
 * Results can be paged with a "Load more" button (default, better UX) or
 * with infinite scrolling - the user can switch between the two and the
 * choice is remembered.
 */
import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import TrendingSection from '../components/TrendingSection';
import { EmptyState, ErrorMessage } from '../components/StatusMessages';
import { useMovies } from '../context/MovieContext';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage';

export default function HomePage() {
  const { query, setQuery, filters, resetFilters, results, hasMore, loadMore, retry } = useMovies();
  const [infinite, setInfinite] = useState(() => readJSON(STORAGE_KEYS.scrollMode, 'button') === 'infinite');

  useEffect(() => {
    document.title = query ? `“${query}” – Movie Explorer` : 'Movie Explorer';
  }, [query]);

  const toggleInfinite = (e) => {
    setInfinite(e.target.checked);
    writeJSON(STORAGE_KEYS.scrollMode, e.target.checked ? 'infinite' : 'button');
  };

  const { items, status, error, totalResults } = results;
  const isFiltered = Boolean(filters.genre || filters.year || filters.minRating);

  // The sentinel only observes while idle, so a failed page doesn't retry in a loop.
  const sentinelRef = useInfiniteScroll(loadMore, {
    enabled: infinite && hasMore && status === 'success',
    itemCount: items.length,
  });

  const heading = query ? `Results for “${query}”` : isFiltered ? 'Discover' : 'Popular right now';
  // Genre/rating filters are applied client-side to search results, so TMDb's total is only exact without them.
  const showCount = status === 'success' && totalResults > 0 && (!query || (!filters.genre && !filters.minRating));

  return (
    <>
      {/* Hero + search */}
      <Box
        sx={{
          pt: { xs: 4, sm: 7 },
          pb: { xs: 3, sm: 5 },
          background: (t) =>
            `radial-gradient(ellipse 80% 70% at 50% -10%, ${t.palette.primary.main}33, transparent 70%)`,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.6rem', md: '3rem' }, mb: 1 }}>
            Find your next favourite film
          </Typography>
          <Typography color="text.secondary" sx={{ mb: { xs: 3, sm: 4 } }}>
            Search millions of movies, explore what's trending and build your watchlist.
          </Typography>
          <Box sx={{ maxWidth: 640, mx: 'auto' }}>
            <SearchBar />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Stack spacing={{ xs: 4, sm: 6 }}>
          {!query && <TrendingSection />}

          <Box component="section" aria-labelledby="results-heading">
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 1,
                mb: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography id="results-heading" variant="h5" component="h2" sx={{ wordBreak: 'break-word' }}>
                  {heading}
                </Typography>
                {showCount && (
                  <Typography variant="body2" color="text.secondary">
                    {totalResults.toLocaleString()} {totalResults === 1 ? 'movie' : 'movies'}
                  </Typography>
                )}
              </Box>
              <FormControlLabel
                control={<Switch size="small" checked={infinite} onChange={toggleInfinite} />}
                label={<Typography variant="body2">Infinite scroll</Typography>}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FilterBar />
            </Box>

            {/* First page failed: show the error instead of the grid */}
            {status === 'error' && items.length === 0 ? (
              <ErrorMessage message={error} onRetry={retry} />
            ) : status === 'success' && items.length === 0 && !hasMore ? (
              <EmptyState
                icon={<SearchOffRoundedIcon />}
                title="No movies found"
                description={
                  query
                    ? 'Try a different title, check the spelling, or loosen your filters.'
                    : 'No movies match these filters. Try widening them.'
                }
                action={
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {query && (
                      <Button variant="outlined" onClick={() => setQuery('')}>
                        Clear search
                      </Button>
                    )}
                    {isFiltered && (
                      <Button variant="contained" onClick={resetFilters}>
                        Clear filters
                      </Button>
                    )}
                  </Stack>
                }
              />
            ) : (
              <MovieGrid movies={items} loading={status === 'loading' || status === 'idle'} />
            )}

            {/* Pagination footer */}
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {status === 'error' && items.length > 0 && (
                <Box sx={{ width: '100%' }}>
                  <ErrorMessage title="Couldn't load more movies" message={error} onRetry={retry} />
                </Box>
              )}

              {status === 'loadingMore' && <CircularProgress aria-label="Loading more movies" />}

              {!infinite && hasMore && status === 'success' && (
                <Button variant="contained" size="large" onClick={loadMore} sx={{ px: 5, borderRadius: 999 }}>
                  Load more
                </Button>
              )}

              {infinite && hasMore && <Box ref={sentinelRef} aria-hidden sx={{ height: 1, width: '100%' }} />}

              {!hasMore && status === 'success' && items.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  You've reached the end 🎬
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
