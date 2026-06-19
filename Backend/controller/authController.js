const jwt = require("jsonwebtoken");
const { sendMaiil } = require("../utils/sendMail");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
}
exports.verify_otp = async (req, res, next) => {
  try {
    const {email , otp} = req.body
    const user = await userModel.findOne({email:email}).select('-password')
    if(!user || user.otp!== otp || Date.now() > user.otpExpires){
      return res.json({
        message:"invalid user or otp or expired otp"
      })
    }
    user.isVerified = true
    user.otp = undefined
    user.otpExpires = undefined
    await user.save()
    const token = generateToken(user._id)
    console.log("user verified successfully",)
    return res.json({
      message:"user verified successfully",
      user : {...user.toObject(),token}
    })
  } catch (error) {
        const message = "error in otp verification 015"
        console.log(message,error)
        return res.json({message:message})
      }
}
exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "email id already in use with another user" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
      // UserObj.token = generateToken(User._id);
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpires = new Date( Date.now() + 10*60*1000)
    const User = await userModel.create({
      name, 
      email,
      password: hashPassword,
      role,
      otp,
      otpExpires
    });
    if (User) {
    const UserObj = User.toObject()
       res.status(200).json({
       message:"user registeation confirmed"
      })
    } else {
      return res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("error during user creation 001", error);
    return res.status(400).json({ message: "error during user creation 001" });
  }
}
exports.getLogin = (req, res, next) => {
  return res.status(405).json({ message: "login endpoint accepts POST requests only" });
};
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const User = await userModel.findOne({ email });
    if (User && await bcrypt.compare(password, User.password)) {
      const UserObj = User.toObject()
      delete UserObj.password
      if(User.twoFA){
        const otp = Math.floor(100000 + Math.random()*900000)
        const otpExpires = new Date( Date.now() + 10*60*1000)
        User.otp = otp
        User.otpExpires = otpExpires
        await User.save()
         sendMaiil(User.email, "Your 2FA Login Code", `Your OTP code is: ${otp}`)
        return res.json({ 
          twoFA: true, 
          message: "Please verify the OTP sent to your email",
          email: User.email 
        })
      }
         UserObj.token = generateToken(User._id)
      return res.json({ User: UserObj });
    }

    return res.status(401).json({ message: "invalid email or password" });
  } catch (error) {
    console.log("error during user login 002", error);
    return res.status(400).json({ message: "error during user login 002" });
  }
}

exports.getAllUsers = (req, res, next) => {
  userModel
    .find({}).select('-password')
    .then((User) => {
      return res.json({ User});
    })
    .catch((err) => {
      console.log("error during user fetching 003", err);
      return res
        .status(400)
        .json({ message: "error during user fetching 003" });
    })
}

exports.sendOtp = async (req , res , next) =>{
  const User = await userModel.findById(req.user._id)
   const otp = Math.floor(100000 + Math.random()*900000)
        const otpExpires = new Date( Date.now() + 10*60*1000)
        User.otp = otp
        User.otpExpires = otpExpires
        await User.save()
        await sendMaiil(User.email, "Your 2FA Login Code", `Your OTP code is: ${otp}`)
        return res.json({ 
          twoFA: true, 
          message: " OTP sent to your email",
          email: User.email 
        })
}
exports.Toggle2FA = async (req ,res) =>{
   try {
     const {id , flag} = req.body
    await userModel.findByIdAndUpdate(id ,{twoFA:flag})
    res.json({message:'2FA updated successfully'})
   } catch (error) {
    const message = 'error in updating 2FA'
    console.log(message,error)
    res.status(400).json({message})
   }

}
