/**
 * Genre / year / minimum-rating filters.
 * Filters apply to both search results and the "browse" (discover) grid.
 */
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { useMovies, EMPTY_FILTERS } from '../context/MovieContext';

const CURRENT_YEAR = new Date().getFullYear();
// Current year + 1 (announced releases) back to 1900.
const YEARS = Array.from({ length: CURRENT_YEAR + 2 - 1900 }, (_, i) => CURRENT_YEAR + 1 - i);
const RATINGS = [9, 8, 7, 6, 5, 4];

export default function FilterBar() {
  const { filters, setFilters, genres } = useMovies();
  const isFiltered = Object.keys(EMPTY_FILTERS).some((k) => filters[k] !== '');

  const handleChange = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const selectSx = { minWidth: { xs: 0, sm: 150 }, flex: { xs: '1 1 30%', sm: '0 0 auto' } };
  const menuProps = { PaperProps: { sx: { maxHeight: 320 } } };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
      <FormControl size="small" sx={selectSx}>
        <InputLabel id="genre-filter">Genre</InputLabel>
        <Select labelId="genre-filter" label="Genre" value={filters.genre} onChange={handleChange('genre')} MenuProps={menuProps}>
          <MenuItem value="">All genres</MenuItem>
          {genres.map((g) => (
            <MenuItem key={g.id} value={String(g.id)}>
              {g.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={selectSx}>
        <InputLabel id="year-filter">Year</InputLabel>
        <Select labelId="year-filter" label="Year" value={filters.year} onChange={handleChange('year')} MenuProps={menuProps}>
          <MenuItem value="">Any year</MenuItem>
          {YEARS.map((y) => (
            <MenuItem key={y} value={String(y)}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={selectSx}>
        <InputLabel id="rating-filter">Rating</InputLabel>
        <Select labelId="rating-filter" label="Rating" value={filters.minRating} onChange={handleChange('minRating')}>
          <MenuItem value="">Any rating</MenuItem>
          {RATINGS.map((r) => (
            <MenuItem key={r} value={String(r)}>
              {r}+ ★
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isFiltered && (
        <Button size="small" startIcon={<RestartAltRoundedIcon />} onClick={() => setFilters(EMPTY_FILTERS)}>
          Clear filters
        </Button>
      )}
    </Box>
  );
}
