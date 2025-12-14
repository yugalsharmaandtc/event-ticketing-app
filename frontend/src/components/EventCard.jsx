// src/components/EventCard.jsx
import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const date = event.date ? new Date(event.date).toLocaleString() : 'TBA';

  // Extract image URL from array
  const imageUrl =
    event.images?.[0]?.url ||
    'https://via.placeholder.com/400x300?text=No+Image';

  const hasPrice = event.price !== null && event.price !== undefined;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 3,
      }}
      variant="outlined"
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <img
          src={imageUrl}
          alt={event.title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        />
        <Typography variant="h6" gutterBottom noWrap>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {event.venue || 'Unknown venue'} — {event.city || 'Unknown city'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {date}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {hasPrice ? (
            <Chip
              label={`From $${event.price}`}
              size="small"
              color="primary"
            />
          ) : (
            <Chip label="Price TBD" size="small" />
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button size="small" onClick={() => navigate(`/events/${event.id}`)}>
          Details
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => navigate(`/checkout/${event.id}`)}
        >
          Book
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
