import { Link as RouterLink } from 'react-router-dom';
import { Button, Container } from '@mui/material';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import { EmptyState } from '../components/StatusMessages';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm">
      <EmptyState
        icon={<MovieFilterOutlinedIcon />}
        title="404 – This scene was cut"
        description="The page you're looking for doesn't exist."
        action={
          <Button variant="contained" component={RouterLink} to="/">
            Back to home
          </Button>
        }
      />
    </Container>
  );
}
