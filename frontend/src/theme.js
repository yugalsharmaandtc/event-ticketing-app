// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6d00',
    },
    secondary: {
      main: '#00b0ff',
    },
    background: {
      default: '#0b1020',
      paper: '#141a2f',
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
