const Razorpay = require('razorpay');
const crypto = require('crypto');

const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY;
const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_KEY;

const getKey = (req, res) => {
  res.status(200).json({ key: keyId });
};

const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    
    // Razorpay accepts amount in paise
    const options = {
      amount: Math.round(req.body.amount * 100),
      currency: "INR",
    };
    
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).send(error);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", keySecret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Razorpay signature verification error:", error);
    res.status(500).send(error);
  }
};

module.exports = { createOrder, verifyPayment, getKey };