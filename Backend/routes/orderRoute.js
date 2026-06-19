const express = require('express')
const { protect, IsAdmin } = require('../middlewares/protect')
const { getAllOrders, createOrder, updatetOrderStatus, getMyOrder, getOrderDetails } = require('../controller/orderController')
const OrderRouter = express.Router()
OrderRouter.route('/').get(protect, IsAdmin, getAllOrders).post(protect, createOrder).put(protect, IsAdmin, updatetOrderStatus)
OrderRouter.get("/my-orders", protect, getMyOrder)
OrderRouter.get("/:id", protect, getOrderDetails)
module.exports = OrderRouter