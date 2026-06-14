const express = require('express')
const { protect, IsAdmin } = require('../middlewares/protect');
const { createOrder, verifyPayment } = require('../controller/paymentController');
const PaymentRouter = express.Router()

PaymentRouter.post('/order', createOrder);
PaymentRouter.post('/verify', verifyPayment);
module.exports = PaymentRouter