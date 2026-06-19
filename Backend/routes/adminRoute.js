const express = require('express')
const {  getAllUsers } = require('../controller/authController')
const { protect, IsAdmin } = require('../middlewares/protect')
const { adminAnalytics } = require('../controller/adminAnalytics')
const adminRouter = express.Router()

adminRouter.get('/alluser' ,protect, IsAdmin, getAllUsers)
adminRouter.get("/analytics", protect, IsAdmin, adminAnalytics)
module.exports = adminRouter