const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware'); // Import auth middleware

// Protect all booking routes with authentication
router.post("/", auth, bookingController.createBooking);
router.get("/:id", auth, bookingController.getBooking);
router.get("/", auth, bookingController.getUserBookings);

module.exports = router;