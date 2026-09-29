/**
 * Reusable feedback components: friendly error messages with a retry
 * button, and empty states.
 */
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

export function ErrorMessage({ message, onRetry, title = 'Oops, something went wrong' }) {
  return (
    <Alert
      severity="error"
      variant="outlined"
      sx={{ borderRadius: 3, alignItems: 'center' }}
      action={
        onRetry && (
          <Button color="inherit" size="small" startIcon={<RefreshRoundedIcon />} onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle sx={{ mb: 0.25 }}>{title}</AlertTitle>
      {message}
    </Alert>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 10 }, px: 2, color: 'text.secondary' }}>
      {icon && <Box sx={{ fontSize: 56, lineHeight: 1, mb: 2, '& svg': { fontSize: 'inherit', opacity: 0.6 } }}>{icon}</Box>}
      <Typography variant="h6" color="text.primary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ maxWidth: 420, mx: 'auto' }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 3 }}>{action}</Box>}
    </Box>
  );
}
