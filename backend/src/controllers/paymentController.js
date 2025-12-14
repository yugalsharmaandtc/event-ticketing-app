const paymentService = require("../services/paymentService");
const bookingModel = require("../models/bookingModel");

async function pay(req, res) {
  try {
    const { bookingId, amount, card } = req.body;

    // Validate input
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId required" });
    }

    if (!amount) {
      return res.status(400).json({ success: false, message: "amount required" });
    }

    console.log('Processing payment for booking:', bookingId, 'amount:', amount);

    // Process payment
    const payment = await paymentService.processPayment({
      bookingId,
      amount,
      card,
    });

    console.log('Payment result:', payment);

    // Update booking with payment status
    if (payment.success) {
      console.log('Payment successful, updating booking...');
      const updatedBooking = await bookingModel.updatePaymentStatus(
        bookingId,
        'success',
        payment.txnId
      );
      console.log('Booking updated:', updatedBooking);

      return res.json({
        success: true,
        message: "Payment successful",
        booking: updatedBooking,
        payment
      });
    } else {
      console.log('Payment failed');
      const updatedBooking = await bookingModel.updatePaymentStatus(
        bookingId,
        'failed',
        payment.txnId
      );

      return res.json({
        success: false,
        message: "Payment failed",
        booking: updatedBooking,
        payment
      });
    }

  } catch (err) {
    console.error('Pay controller error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Payment failed" 
    });
  }
}

module.exports = { pay };