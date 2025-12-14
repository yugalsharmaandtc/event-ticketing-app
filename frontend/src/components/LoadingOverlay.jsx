// src/components/LoadingOverlay.jsx
import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const LoadingOverlay = ({ open }) => (
  <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
  >
    <CircularProgress />
  </Backdrop>
);

export default LoadingOverlay;
