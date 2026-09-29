/**
 * Plays a YouTube trailer in a modal using the privacy-friendly
 * youtube-nocookie embed. Full-screen on phones.
 */
import { Dialog, IconButton, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export default function TrailerDialog({ open, onClose, videoKey, title }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      aria-label={`${title} trailer`}
      PaperProps={{ sx: { bgcolor: '#000', justifyContent: 'center' } }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close trailer"
        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: '#fff', bgcolor: 'rgba(0,0,0,.5)' }}
      >
        <CloseRoundedIcon />
      </IconButton>
      {/* Only mount the iframe while open so the video stops when the dialog closes */}
      {open && videoKey && (
        <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
          <Box
            component="iframe"
            src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={`${title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </Box>
      )}
    </Dialog>
  );
}
