const exp = require('express');
const { getCart, addToCart, deleteFromCart } = require('../controller/cartController');
const { protect } = require('../middlewares/protect');
const cartRouter = exp.Router()
cartRouter.get('/cart', protect, getCart)
cartRouter.post('/cart', protect, addToCart)
cartRouter.delete('/cart', protect, deleteFromCart)

module.exports = cartRouter ;