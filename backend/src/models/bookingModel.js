const pool = require("../config/db");

// Function to create a new Booking
async function createBooking({user_id, event_id, price, booking_status = 'reserved'}) {
    const res = await pool.query(
        `INSERT INTO bookings(user_id, event_id, price, booking_status, payment_status) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [user_id, event_id, price, booking_status, 'pending']
    );
    return res.rows[0];
}

async function getBookingById(id) {
  // Fetch booking details
  const bookingRes = await pool.query(
    `SELECT *
     FROM bookings
     WHERE id = $1`,
    [id]
  );

  if (bookingRes.rows.length === 0) return null;

  const booking = bookingRes.rows[0];

  // Fetch passenger list
  const passengersRes = await pool.query(
    `SELECT id, name, phone
     FROM booking_passengers
     WHERE booking_id = $1
     ORDER BY id ASC`,
    [id]
  );

  return {
    booking,
    passengers: passengersRes.rows,
  };
}


async function updatePaymentStatus(bookingId, paymentStatus, txnId) {
    const bookingStatus = paymentStatus === 'success' ? 'confirmed' : 'cancelled';
    const res = await pool.query(
        "UPDATE bookings SET payment_status=$1, booking_status=$2, payment_txn_id=$3 WHERE id=$4 RETURNING *",
        [paymentStatus, bookingStatus, txnId, bookingId]
    );
    return res.rows[0];
}

async function getBookingsByUserId(userId) {
    const res = await pool.query("SELECT * FROM bookings WHERE user_id=$1 ORDER BY created_at DESC", [userId]);
    return res.rows;
}

module.exports = { createBooking, getBookingById, updatePaymentStatus, getBookingsByUserId };