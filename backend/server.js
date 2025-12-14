require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDb = require("./db/initDb.js");



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Importing route modules
const eventRoutes = require("./src/routes/eventRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const authRoutes = require('./src/routes/authRoutes');

// Registering routes
// Auth routes (no auth middleware needed - they handle login/signup)
app.use('/api/auth', authRoutes);

// Event routes (public - no auth needed)
app.use("/api/events", eventRoutes);

// Booking routes (protected - auth middleware is in bookingRoutes.js)
app.use("/api/bookings", bookingRoutes);

// Payment routes (should be protected if needed)
app.use("/api/payments", paymentRoutes);

// Health check route
app.get("/", (req, res) => {
    res.json({ success: true, message: "Backend is running successfully" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal server error' 
    });
});

(async () => {
  await initDb();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
