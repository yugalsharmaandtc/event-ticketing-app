// src/pages/MyBookings.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getBookingsByUser } from '../api/api';
import LoadingOverlay from '../components/LoadingOverlay';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const data = await getBookingsByUser();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error loading bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <LoadingOverlay open={loading} />
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Bookings
      </Typography>

      <Paper sx={{ mt: 2, borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#1e0202ff' }}>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Event ID</strong>
              </TableCell>
              <TableCell>
                <strong>Passenger</strong>
              </TableCell>
              <TableCell>
                <strong>Phone</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
              <TableCell>
                <strong>Booking Status</strong>
              </TableCell>
              <TableCell>
                <strong>Payment Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow
                key={b.id}
                hover
                onClick={() => navigate(`/bookings/${b.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{b.id}</TableCell>
                <TableCell>{b.event_id}</TableCell>
                <TableCell>{b.pax_name}</TableCell>
                <TableCell>{b.phone}</TableCell>
                <TableCell>${b.price}</TableCell>
                <TableCell>
                  <Chip
                    label={b.booking_status}
                    color={b.booking_status === 'confirmed' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={b.payment_status}
                    color={
                      b.payment_status === 'success'
                        ? 'success'
                        : b.payment_status === 'failed'
                        ? 'error'
                        : 'warning'
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
            {!loading && bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">
                    No bookings yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default MyBookings;
