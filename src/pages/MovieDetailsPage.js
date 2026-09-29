/**
 * Movie details: backdrop hero, poster, rating, genres, overview,
 * trailer (YouTube embed), cast, key facts and similar movies.
 */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import { getMovieDetails, imageUrl, toFriendlyError } from '../api/tmdb';
import { formatMoney, formatRating, formatRuntime, pickTrailer, releaseYear } from '../utils/format';
import { useFavorites } from '../context/FavoritesContext';
import CastList from '../components/CastList';
import MovieRow from '../components/MovieRow';
import TrailerDialog from '../components/TrailerDialog';
import { ErrorMessage } from '../components/StatusMessages';

/** Label/value pair in the "Details" section. */
function Fact({ label, value }) {
  if (!value) return null;
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="dt">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} component="dd" sx={{ m: 0 }}>
        {value}
      </Typography>
    </Box>
  );
}

function DetailsSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Grid container spacing={{ xs: 3, md: 5 }}>
        <Grid item xs={12} sm={4} md={3.5}>
          <Skeleton variant="rounded" sx={{ aspectRatio: '2 / 3', height: 'auto', maxWidth: 300, mx: 'auto', borderRadius: 3 }} />
        </Grid>
        <Grid item xs={12} sm={8} md={8.5}>
          <Skeleton variant="text" sx={{ fontSize: '2.5rem', width: '70%' }} />
          <Skeleton width="40%" />
          <Skeleton width="50%" sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={120} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [state, setState] = useState({ movie: null, status: 'loading', error: null });
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ movie: null, status: 'loading', error: null });
    setTrailerOpen(false);

    getMovieDetails(id, { signal: controller.signal })
      .then((movie) => setState({ movie, status: 'success', error: null }))
      .catch((err) => {
        const message = toFriendlyError(err);
        if (message) setState({ movie: null, status: 'error', error: message });
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  const { movie, status, error } = state;

  useEffect(() => {
    if (movie) document.title = `${movie.title} (${releaseYear(movie.release_date)}) – Movie Explorer`;
  }, [movie]);

  // Go back if we came from inside the app, otherwise go home.
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/'));

  const backButton = (
    <Button startIcon={<ArrowBackRoundedIcon />} onClick={goBack} color="inherit" sx={{ mb: 2 }}>
      Back
    </Button>
  );

  if (status === 'loading') return <DetailsSkeleton />;

  if (status === 'error') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        {backButton}
        <ErrorMessage title="Couldn't load this movie" message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      </Container>
    );
  }

  const trailer = pickTrailer(movie.videos);
  const favorite = isFavorite(movie.id);
  const poster = imageUrl(movie.poster_path, 'w500');
  const backdrop = imageUrl(movie.backdrop_path, 'w1280');
  const directors = (movie.credits?.crew || []).filter((c) => c.job === 'Director').map((c) => c.name);
  const similar = (movie.similar?.results || []).slice(0, 15);

  return (
    <>
      {/* Backdrop hero */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          '&::before': backdrop
            ? {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${backdrop})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                opacity: 0.35,
              }
            : undefined,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: (t) =>
              `linear-gradient(180deg, ${alpha(t.palette.background.default, 0.4)} 0%, ${t.palette.background.default} 100%)`,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 2, md: 3 }, pb: { xs: 4, md: 6 } }}>
          {backButton}

          <Grid container spacing={{ xs: 3, md: 5 }} alignItems="flex-start">
            <Grid item xs={12} sm={4} md={3.5}>
              <Box
                sx={{
                  maxWidth: { xs: 220, sm: 300 },
                  mx: 'auto',
                  aspectRatio: '2 / 3',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: 12,
                  bgcolor: 'action.hover',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {poster ? (
                  <Box component="img" src={poster} alt={`${movie.title} poster`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <MovieFilterOutlinedIcon sx={{ fontSize: 64, opacity: 0.4 }} />
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={8} md={8.5}>
              <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '1.9rem', sm: '2.4rem', md: '3rem' } }}>
                {movie.title}{' '}
                <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  ({releaseYear(movie.release_date)})
                </Box>
              </Typography>

              {/* Meta line: rating · runtime · release date */}
              <Stack direction="row" flexWrap="wrap" alignItems="center" columnGap={2} rowGap={0.5} sx={{ mt: 1.5, color: 'text.secondary' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.primary' }}>
                  <StarRoundedIcon sx={{ color: 'secondary.main' }} />
                  <Typography fontWeight={700}>{formatRating(movie.vote_average)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    / 10 · {movie.vote_count?.toLocaleString()} votes
                  </Typography>
                </Box>
                {formatRuntime(movie.runtime) && <Typography variant="body2">{formatRuntime(movie.runtime)}</Typography>}
                {movie.release_date && (
                  <Typography variant="body2">
                    {new Date(movie.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                )}
              </Stack>

              {movie.genres?.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                  {movie.genres.map((g) => (
                    <Chip key={g.id} label={g.name} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}

              {movie.tagline && (
                <Typography sx={{ mt: 3, fontStyle: 'italic' }} color="text.secondary">
                  “{movie.tagline}”
                </Typography>
              )}

              <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 1 }}>
                Overview
              </Typography>
              <Typography sx={{ lineHeight: 1.75, maxWidth: '70ch' }}>
                {movie.overview || 'No overview available for this movie yet.'}
              </Typography>

              {directors.length > 0 && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <Box component="span" color="text.secondary">
                    Directed by{' '}
                  </Box>
                  <strong>{directors.join(', ')}</strong>
                </Typography>
              )}

              {/* Actions */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
                {trailer && (
                  <Button variant="contained" size="large" startIcon={<PlayArrowRoundedIcon />} onClick={() => setTrailerOpen(true)}>
                    Play trailer
                  </Button>
                )}
                <Button
                  variant={favorite ? 'contained' : 'outlined'}
                  color={favorite ? 'secondary' : 'inherit'}
                  size="large"
                  startIcon={favorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
                  onClick={() => toggleFavorite(movie)}
                  aria-pressed={favorite}
                >
                  {favorite ? 'In favorites' : 'Add to favorites'}
                </Button>
                {trailer && (
                  <Button
                    size="large"
                    color="inherit"
                    startIcon={<YouTubeIcon />}
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch on YouTube
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Stack spacing={5}>
          <Box component="section">
            <Typography variant="h5" component="h2" gutterBottom>
              Top cast
            </Typography>
            <CastList cast={movie.credits?.cast} />
          </Box>

          <Divider />

          <Box component="section">
            <Typography variant="h5" component="h2" gutterBottom>
              Details
            </Typography>
            <Box
              component="dl"
              sx={{ m: 0, display: 'grid', gap: 2, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}
            >
              <Fact label="Status" value={movie.status} />
              <Fact label="Original language" value={movie.spoken_languages?.find((l) => l.iso_639_1 === movie.original_language)?.english_name || movie.original_language?.toUpperCase()} />
              <Fact label="Budget" value={formatMoney(movie.budget)} />
              <Fact label="Revenue" value={formatMoney(movie.revenue)} />
              <Fact label="Production" value={movie.production_companies?.slice(0, 3).map((c) => c.name).join(', ')} />
              <Fact label="Countries" value={movie.production_countries?.map((c) => c.name).join(', ')} />
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              {movie.homepage && (
                <Button size="small" endIcon={<OpenInNewRoundedIcon />} href={movie.homepage} target="_blank" rel="noopener noreferrer">
                  Official site
                </Button>
              )}
              <Button
                size="small"
                endIcon={<OpenInNewRoundedIcon />}
                href={`https://www.themoviedb.org/movie/${movie.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on TMDb
              </Button>
            </Stack>
          </Box>

          {similar.length > 0 && (
            <>
              <Divider />
              <Box component="section">
                <Typography variant="h5" component="h2" gutterBottom>
                  More like this
                </Typography>
                <MovieRow label="Similar movies" movies={similar} />
              </Box>
            </>
          )}
        </Stack>
      </Container>

      {trailer && (
        <TrailerDialog open={trailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer.key} title={movie.title} />
      )}
    </>
  );
}
