// src/pages/Signup.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { signup } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { login: authLogin } = useAuth(); // Get login function from context
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      setLoading(true);
      const res = await signup(values);
      if (!res.success) {
        throw new Error(res.message || 'Signup failed');
      }
      // Use authLogin from context
      authLogin(res.user, res.token);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Signup error', err);
      setErrorMsg(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '70vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
          Sign up
        </Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={values.name}
              onChange={handleChange('name')}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              value={values.phone}
              onChange={handleChange('phone')}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange('password')}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button component={RouterLink} to="/login" size="small">
                Login
              </Button>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;