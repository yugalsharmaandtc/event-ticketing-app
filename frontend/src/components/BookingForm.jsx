// src/components/BookingForm.jsx
import React from 'react';
import {
  TextField,
  Stack,
  Button,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const BookingForm = ({
  passengers,
  setPassengers,
  card,
  setCard,
  onSubmit,
  loading,
}) => {
  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const addPassenger = () => {
    if (passengers.length >= 10) return;
    setPassengers((prev) => [...prev, { name: '', phone: '' }]);
  };

  const removePassenger = (index) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCardChange = (field) => (e) => {
    setCard((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Passengers</Typography>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={addPassenger}
            disabled={passengers.length >= 10}
          >
            Add Passenger
          </Button>
        </Stack>

        <Stack spacing={2}>
          {passengers.map((p, index) => (
            <Stack
              key={index}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems="flex-end"
            >
              <TextField
                label={`Passenger ${index + 1} Name`}
                value={p.name}
                onChange={(e) =>
                  handlePassengerChange(index, 'name', e.target.value)
                }
                fullWidth
                required
              />
              <TextField
                label="Phone"
                value={p.phone}
                onChange={(e) =>
                  handlePassengerChange(index, 'phone', e.target.value)
                }
                fullWidth
                required
              />
              <IconButton
                onClick={() => removePassenger(index)}
                disabled={passengers.length <= 1}
              >
                <RemoveIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        <Divider />

        <Typography variant="h6">Card Details (simulated)</Typography>
        <TextField
          label="Card Number"
          value={card.number}
          onChange={handleCardChange('number')}
          fullWidth
          required
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Expiry"
            value={card.expiry}
            onChange={handleCardChange('expiry')}
            fullWidth
          />
          <TextField
            label="CVV"
            value={card.cvv}
            onChange={handleCardChange('cvv')}
            fullWidth
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay & Confirm Booking'}
        </Button>
      </Stack>
    </form>
  );
};

export default BookingForm;
