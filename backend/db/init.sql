-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- EVENTS CACHE (OPTIONAL)
-- =========================
CREATE TABLE IF NOT EXISTS events_cache (
    id VARCHAR(100) PRIMARY KEY,
    title TEXT,
    description TEXT,
    venue TEXT,
    city VARCHAR(100),
    event_date TIMESTAMP,
    price NUMERIC(10,2),
    raw JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- BOOKINGS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id VARCHAR(100) NOT NULL,
    pax_name VARCHAR(200),
    phone VARCHAR(15),
    price NUMERIC(10,2) NOT NULL,
    booking_status VARCHAR(30) DEFAULT 'reserved',
    payment_status VARCHAR(30) DEFAULT 'pending',
    payment_txn_id VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- BOOKING PASSENGERS
-- =========================
CREATE TABLE IF NOT EXISTS booking_passengers (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT
);

-- =========================
-- INDEXES (PERFORMANCE)
-- =========================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_passengers_booking_id ON booking_passengers(booking_id);
