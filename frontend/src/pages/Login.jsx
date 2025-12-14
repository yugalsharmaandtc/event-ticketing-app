// src/pages/Login.jsx
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
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { login } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [values, setValues] = useState({
    email: '',
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
      const res = await login(values);
      if (!res.success) {
        throw new Error(res.message || 'Login failed');
      }
      authLogin(res.user, res.token);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error', err);
      setErrorMsg(err.message || 'Login failed');
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
          Login
        </Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              fullWidth
              required
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Button component={RouterLink} to="/signup" size="small">
                Sign up
              </Button>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
