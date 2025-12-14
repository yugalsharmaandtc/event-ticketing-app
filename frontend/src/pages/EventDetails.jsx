// src/pages/EventDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Stack,
  Paper,
  Button,
  Chip,
  Box,
  Alert,
  Divider
} from '@mui/material';
import { getEventById } from '../api/api';
import LoadingOverlay from '../components/LoadingOverlay';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data.event || null);
      } catch (err) {
        console.error('Error loading event', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const date = event?.date ? new Date(event.date).toLocaleString() : 'TBA';

  return (
    <>
      <LoadingOverlay open={loading} />
      {!event && !loading && <Typography>Event not found.</Typography>}

      {event && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          {/* Event Image */}
          {event.image && (
            <Box sx={{ mb: 2 }}>
              <img
                src={event.image}
                alt={event.title}
                style={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 16
                }}
              />
            </Box>
          )}

          {/* Title */}
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>

          {/* Venue + City */}
          <Typography variant="body1" gutterBottom>
            {event.venue || 'Unknown venue'} — {event.city || 'Unknown city'}
          </Typography>

          {/* Date */}
          <Typography variant="body2" gutterBottom>
            {date}
          </Typography>

          {/* Price */}
          {event.price && (
            <Chip label={`From $${event.price}`} color="primary" sx={{ mt: 1 }} />
          )}

          {/* Price Range */}
          {event.priceRanges?.[0] && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Price Range: ${event.priceRanges[0].min} - ${event.priceRanges[0].max}
            </Typography>
          )}

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* Description */}
          {event.description && (
  <Typography variant="body1">{event.description}</Typography>
)}
{event.info && event.info !== event.description && (
  <Typography variant="body2" sx={{ mt: 2 }}>{event.info}</Typography>
)}
          {/* Please Note */}
          {event.pleaseNote && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {event.pleaseNote}
            </Alert>
          )}

          {/* Footer Buttons */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(`/checkout/${event.id}`)}
            >
              Book this event
            </Button>
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default EventDetails;
