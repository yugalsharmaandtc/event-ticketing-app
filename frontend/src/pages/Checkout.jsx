// src/pages/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import { getEventById, createBooking, payForBooking } from '../api/api';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import LoadingOverlay from '../components/LoadingOverlay';

const Checkout = () => {
  const { user } = useAuth(); // Get user from context
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [statusType, setStatusType] = useState('info');

  // passengers and card state
  const [passengers, setPassengers] = useState(() => [
    {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  ]);

  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;

    try {
      setLoading(true);
      setStatusMsg(null);

      const validPassengers = passengers.filter(
        (p) => p.name.trim() && p.phone.trim()
      );
      if (validPassengers.length === 0) {
        throw new Error('Please add at least one passenger with name and phone.');
      }

      // Use nullish coalescing so only null/undefined become 0
      const pricePerTicket = event.price ?? 0;
      const totalPrice = pricePerTicket * validPassengers.length;

      // Step 1: create booking with passengers (user comes from JWT)
      const bookingPayload = {
        event_id: event.id,
        price: totalPrice,
        passengers: validPassengers,
      };

      console.log('Creating booking with payload:', bookingPayload);

      const bookingRes = await createBooking(bookingPayload);
      console.log('Booking response:', bookingRes);

      if (!bookingRes.success) {
        throw new Error(bookingRes.message || 'Booking failed');
      }

      const booking = bookingRes.booking;

      // Step 2: simulate payment
      const paymentPayload = {
        bookingId: booking.id,
        amount: totalPrice,
        card: {
          number: card.number,
          expiry: card.expiry,
          cvv: card.cvv,
        },
      };

      console.log('Processing payment with payload:', paymentPayload);

      const payRes = await payForBooking(paymentPayload);
      console.log('Payment response:', payRes);

      if (!payRes.success) {
        throw new Error(payRes.message || 'Payment failed');
      }

      if (payRes.payment.success) {
        setStatusType('success');
        setStatusMsg(`Payment successful! Txn ID: ${payRes.payment.txnId}`);
        setTimeout(() => navigate('/bookings'), 1500);
      } else {
        setStatusType('error');
        setStatusMsg('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error', err);
      setStatusType('error');
      setStatusMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay open={loading} />
      {!event && !loading && <Typography>Event not found.</Typography>}
      {event && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            Checkout — {event.title}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {event.venue || 'Unknown venue'} — {event.city || 'Unknown city'}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {event.date ? new Date(event.date).toLocaleString() : 'TBA'}
          </Typography>
          {event.price != null ? (
            <Typography variant="body1" sx={{ mt: 1 }}>
              Price per ticket: ${event.price}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Price not provided by Ticketmaster — total will be treated as $0 for this demo.
            </Typography>
          )}

          <Stack spacing={2} sx={{ mt: 3 }}>
            {statusMsg && <Alert severity={statusType}>{statusMsg}</Alert>}
            <BookingForm
              passengers={passengers}
              setPassengers={setPassengers}
              card={card}
              setCard={setCard}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default Checkout;
