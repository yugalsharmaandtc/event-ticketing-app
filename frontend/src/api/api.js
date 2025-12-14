// src/api/api.js

// Backend base URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Helper to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch helper
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// ===================== AUTH APIs =====================

export function signup(data) {
  return apiFetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return apiFetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ===================== EVENT APIs =====================

export function searchEvents({ q, city, page = 0 }) {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (city) params.append("city", city);
  params.append("page", page);

  return apiFetch(`${API_BASE}/events?${params.toString()}`);
}

export function getEventById(id) {
  return apiFetch(`${API_BASE}/events/${id}`);
}

// ===================== BOOKING APIs =====================

export function createBooking(data) {
  return apiFetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
}

export function getBookingsByUser() {
  return apiFetch(`${API_BASE}/bookings`, {
    headers: {
      ...getAuthHeader(),
    },
  });
}

export function getBookingById(id) {
  return apiFetch(`${API_BASE}/bookings/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
}

// ===================== PAYMENT APIs =====================

export function payForBooking(data) {
  return apiFetch(`${API_BASE}/payments/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
}
