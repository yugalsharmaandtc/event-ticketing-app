const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post("/pay", paymentController.pay);  // ← CHANGED from "/payments/pay" to "/pay"

module.exports = router;