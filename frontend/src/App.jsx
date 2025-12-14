// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import Checkout from './pages/Checkout';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookingDetails from './pages/BookingDetails'; // 👈 make sure this file exists

// Wrapper component for protected routes
const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events/:id" element={<EventDetails />} />

      {/* Booking details should also be protected */}
      <Route
        path="/bookings/:id"
        element={
          <RequireAuth>
            <BookingDetails />
          </RequireAuth>
        }
      />

      <Route
        path="/checkout/:id"
        element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        }
      />

      <Route
        path="/bookings"
        element={
          <RequireAuth>
            <MyBookings />
          </RequireAuth>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </AuthProvider>
  );
};

export default App;
