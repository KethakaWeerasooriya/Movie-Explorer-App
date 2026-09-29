/** Horizontally scrolling list of top-billed cast members. */
import { Avatar, Box, Typography } from '@mui/material';
import { imageUrl } from '../api/tmdb';

export default function CastList({ cast = [], limit = 15 }) {
  if (cast.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No cast information available.
      </Typography>
    );
  }

  return (
    <Box
      component="ul"
      sx={{ display: 'flex', gap: 2, overflowX: 'auto', listStyle: 'none', m: 0, p: 0, pb: 1.5, scrollSnapType: 'x proximity' }}
    >
      {cast.slice(0, limit).map((person) => (
        <Box component="li" key={person.credit_id} sx={{ flex: '0 0 auto', width: 96, textAlign: 'center', scrollSnapAlign: 'start' }}>
          <Avatar
            src={imageUrl(person.profile_path, 'w185') || undefined}
            alt={person.name}
            sx={{ width: 80, height: 80, mx: 'auto', mb: 1, fontSize: 28 }}
          >
            {person.name?.[0]}
          </Avatar>
          <Typography variant="caption" component="p" fontWeight={700} lineHeight={1.3}>
            {person.name}
          </Typography>
          <Typography variant="caption" component="p" color="text.secondary" lineHeight={1.3}>
            {person.character}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
