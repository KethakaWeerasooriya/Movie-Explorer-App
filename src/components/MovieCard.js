/**
 * A single movie poster tile: poster, title, release year and rating,
 * plus a favourite toggle. Clicking the card opens the details page.
 */
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, IconButton, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import { imageUrl } from '../api/tmdb';
import { formatRating, releaseYear } from '../utils/format';
import { useFavorites } from '../context/FavoritesContext';

function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);
  const poster = imageUrl(movie.poster_path, 'w342');

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        bgcolor: 'transparent',
        boxShadow: 'none',
        '&:hover .poster': { transform: 'scale(1.04)' },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/movie/${movie.id}`}
        aria-label={`${movie.title} (${releaseYear(movie.release_date)})`}
        sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* Poster with a fixed 2:3 aspect ratio so the grid never jumps while images load */}
        <Box
          sx={{
            position: 'relative',
            aspectRatio: '2 / 3',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'action.hover',
          }}
        >
          {poster ? (
            <Box
              component="img"
              className="poster"
              src={poster}
              alt=""
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .35s ease' }}
            />
          ) : (
            <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', color: 'text.secondary' }}>
              <MovieFilterOutlinedIcon sx={{ fontSize: 48, opacity: 0.5 }} />
            </Box>
          )}

          {/* Rating badge */}
          <Box
            sx={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              px: 0.9,
              py: 0.3,
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
              borderRadius: 2,
              bgcolor: alpha('#000', 0.72),
              color: '#fff',
              backdropFilter: 'blur(4px)',
            }}
          >
            <StarRoundedIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
            <Typography component="span" variant="caption" fontWeight={700}>
              {formatRating(movie.vote_average)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ pt: 1.2, px: 0.25, pb: 0.5 }}>
          <Typography variant="subtitle2" fontWeight={700} noWrap title={movie.title}>
            {movie.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {releaseYear(movie.release_date)}
          </Typography>
        </Box>
      </CardActionArea>

      {/* Favourite toggle sits outside the link so clicks don't trigger navigation */}
      <Tooltip title={favorite ? 'Remove from favorites' : 'Add to favorites'}>
        <IconButton
          size="small"
          onClick={() => toggleFavorite(movie)}
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: alpha('#000', 0.55),
            color: favorite ? 'primary.main' : '#fff',
            '&:hover': { bgcolor: alpha('#000', 0.75) },
          }}
        >
          {favorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Card>
  );
}

export default memo(MovieCard);
