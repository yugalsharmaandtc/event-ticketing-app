// backend/src/controllers/bookingController.js
const userModel = require("../models/userModel");
const bookingModel = require("../models/bookingModel");
const passengerModel = require("../models/passengerModel");
const ticketmasterService = require("../services/ticketmasterService");

async function createBooking(req, res) {
  try {
    const { passengers, event_id, price } = req.body;
    const user_id = req.user.id;  // from JWT

    // Allow price = 0; only reject if undefined / null / NaN
    const priceIsMissing =
      price === undefined || price === null || Number.isNaN(Number(price));

    if (!event_id || priceIsMissing || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: event_id, price, and passengers",
      });
    }

    const booking = await bookingModel.createBooking({
      user_id,
      event_id,
      price,
      booking_status: "confirmed",
    });

    for (const p of passengers) {
      await passengerModel.addPassenger({
        booking_id: booking.id,
        name: p.name,
        phone: p.phone,
      });
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("createBooking error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
}

async function getBooking(req, res) {
   try {
    const bookingId = req.params.id;
    const result = await bookingModel.getBookingById(bookingId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.json({
      success: true,
      booking: result.booking,
      passengers: result.passengers,
    });

  } catch (err) {
    console.error("Booking lookup failed", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

async function getUserBookings(req, res) {
  try {
    const user_id = req.user.id;
    const bookings = await bookingModel.getBookingsByUserId(user_id);
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("getUserBookings error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
}

module.exports = { createBooking, getBooking, getUserBookings };
