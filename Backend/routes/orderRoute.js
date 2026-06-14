const express = require('express')
const { protect, IsAdmin } = require('../middlewares/protect')
const { getAllOrders, createOrder, updatetOrderStatus, deleteOrders, getMyOrder } = require('../controller/orderController')
const OrderRouter = express.Router()
OrderRouter.route('/').get(protect,IsAdmin ,getAllOrders).post(protect,IsAdmin ,createOrder).put(protect,IsAdmin ,updatetOrderStatus)
OrderRouter.get("/my-orders", getMyOrder)
OrderRouter.get('/' ,protect, IsAdmin)
module.exports = OrderRouter