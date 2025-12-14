// src/api/api.js
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth APIs
export async function signup(data) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Event APIs
export async function searchEvents({ q, city, page = 0 }) {
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (city) params.append('city', city);
  params.append('page', page);

  const res = await fetch(`${API_BASE}/events?${params}`);
  return res.json();
}

export async function getEventById(id) {
  const res = await fetch(`${API_BASE}/events/${id}`);
  return res.json();
}

// Booking APIs (Protected - require auth token)
export async function createBooking(data) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(), // Add JWT token
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getBookingsByUser() {
  const res = await fetch(`${API_BASE}/bookings`, {
    headers: {
      ...getAuthHeader(), // Add JWT token
    },
  });
  return res.json();
}

export async function getBookingById(id) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    headers: {
      ...getAuthHeader(), // Add JWT token
    },
  });
  return res.json();
}

// Payment API
export async function payForBooking(data) {
  const res = await fetch(`${API_BASE}/payments/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(), // Add JWT token if needed
    },
    body: JSON.stringify(data),
  });
  return res.json();
}