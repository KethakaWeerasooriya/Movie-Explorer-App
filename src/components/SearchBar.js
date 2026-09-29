/**
 * Search input. Typing is debounced before updating the global query so
 * we don't fire a request on every keystroke; pressing Enter searches
 * immediately.
 */
import { useEffect, useRef, useState } from 'react';
import { IconButton, InputAdornment, Paper, InputBase } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import useDebounce from '../hooks/useDebounce';
import { useMovies } from '../context/MovieContext';

export default function SearchBar() {
  const { query, setQuery } = useMovies();
  const [text, setText] = useState(query);
  const debounced = useDebounce(text, 500);
  const inputRef = useRef(null);

  // Push debounced text into the global query.
  useEffect(() => {
    if (debounced.trim() !== query) setQuery(debounced);
    // Only react to the user's typing, not to external query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Keep the input in sync if the query is changed elsewhere (e.g. restored from storage).
  useEffect(() => {
    setText((current) => (current.trim() === query ? current : query));
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(text);
    inputRef.current?.blur(); // hides the on-screen keyboard on mobile
  };

  const handleClear = () => {
    setText('');
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <Paper
      component="form"
      role="search"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.5,
        borderRadius: 999,
        border: 1,
        borderColor: 'divider',
        transition: 'border-color .2s, box-shadow .2s',
        '&:focus-within': { borderColor: 'primary.main', boxShadow: (t) => `0 0 0 4px ${t.palette.primary.main}22` },
      }}
    >
      <InputBase
        inputRef={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search for a movie…"
        inputProps={{ 'aria-label': 'Search movies', enterKeyHint: 'search' }}
        sx={{ flex: 1, fontSize: { xs: 16, sm: 17 }, py: 0.75 }}
        startAdornment={
          <InputAdornment position="start">
            <SearchRoundedIcon color="action" />
          </InputAdornment>
        }
      />
      {text && (
        <IconButton aria-label="Clear search" onClick={handleClear} size="small">
          <CloseRoundedIcon />
        </IconButton>
      )}
    </Paper>
  );
}
