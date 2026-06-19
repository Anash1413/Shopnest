const express = require('express')
const { protect, IsAdmin } = require('../middlewares/protect');
const { createOrder, verifyPayment, getKey } = require('../controller/paymentController');
const PaymentRouter = express.Router()

PaymentRouter.get('/key', protect, getKey);
PaymentRouter.post('/order', protect, createOrder);
PaymentRouter.post('/verify', protect, verifyPayment);
module.exports = PaymentRouter