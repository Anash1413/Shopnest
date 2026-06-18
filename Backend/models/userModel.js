const { default: mongoose } = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  twoFA: { type: Boolean, default: false },
  otp: { type: String },          // Store generated OTP
  otpExpires: { type: Date }  ,    // Store expiration timestamp ( 10 mins)
  cart : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }],
  favourites : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }]
});

 module.exports = mongoose.model('User' , UserSchema)