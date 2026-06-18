const express = require('express')
const { getSignup, postSignup, getLogin, postLogin, getAllUsers, verify_otp, sendOtp } = require('../controller/authController')
const { protect, IsAdmin } = require('../middlewares/protect')
const authRouter = express.Router()
authRouter.route("/signup").post(postSignup)
authRouter.route("/login").get(getLogin).post(postLogin)
authRouter.post("/send-otp",protect,sendOtp)
authRouter.route("/verify-otp").post(protect,verify_otp)
module.exports = authRouter