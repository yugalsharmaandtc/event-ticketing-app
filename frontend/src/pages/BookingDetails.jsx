// src/pages/BookingDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Paper,
  Chip,
  Stack,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { getBookingById, getEventById } from "../api/api";
import LoadingOverlay from "../components/LoadingOverlay";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [event, setEvent] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // 1) Get booking + passengers
        const bookingRes = await getBookingById(id);
        setBooking(bookingRes.booking);
        setPassengers(bookingRes.passengers || []);

        // 2) Load event details
        if (bookingRes.booking?.event_id) {
          const eventRes = await getEventById(bookingRes.booking.event_id);
          setEvent(eventRes.event);
        }
      } catch (err) {
        console.error("Error loading booking details", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingOverlay open />;
  if (!booking) return <Typography>No booking found</Typography>;

  const formattedDate = event?.date
    ? new Date(event.date).toLocaleString()
    : "TBA";

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      {/* Event section */}
      {event && (
        <>
          <Stack direction="row" spacing={2}>
            <Box sx={{ width: 300, height: 180, overflow: "hidden" }}>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              )}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                {event.title}
              </Typography>

              <Typography variant="body1">
                {event.venue || "Unknown Venue"} — {event.city || "Unknown City"}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                {formattedDate}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />
        </>
      )}

      {/* Booking info */}
      <Typography variant="h5" gutterBottom>
        Booking Details
      </Typography>

      <Typography variant="body1">Booking ID: {booking.id}</Typography>
      <Typography variant="body1">Price: ${booking.price}</Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        Booking:
        <Chip label={booking.booking_status} sx={{ ml: 1 }} />
      </Typography>

      <Typography variant="body1" sx={{ mt: 1 }}>
        Payment:
        <Chip label={booking.payment_status} sx={{ ml: 1 }} />
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Passenger list */}
      <Typography variant="h5" gutterBottom>
        Passengers
      </Typography>

      {passengers.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No passenger data available.
        </Typography>
      )}

      {passengers.length > 0 &&
        passengers.map((p) => (
          <Typography key={p.id} variant="body1" sx={{ mb: 1 }}>
            {p.name} — {p.phone}
          </Typography>
        ))}

      <Button sx={{ mt: 3 }} variant="outlined" onClick={() => navigate("/bookings")}>
        Back to My Bookings
      </Button>
    </Paper>
  );
};

export default BookingDetails;
