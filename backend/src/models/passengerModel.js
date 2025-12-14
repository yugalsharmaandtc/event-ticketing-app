const pool = require('../config/db');

async function addPassenger({booking_id,name,phone}){
  await pool.query(
    `INSERT INTO booking_passengers (booking_id,name,phone)
     VALUES ($1,$2,$3)`,
    [booking_id,name,phone]
  );
}

async function getPassengersByBooking(booking_id){
  const res = await pool.query(
    `SELECT * FROM booking_passengers WHERE booking_id=$1`,
    [booking_id]
  );
  return res.rows;
}

module.exports = { addPassenger, getPassengersByBooking };
