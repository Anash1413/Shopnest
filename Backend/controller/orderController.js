const orderModel = require("../models/orderModel")

exports.getAllOrders = async (req , res , next)=>{
    try {
        const orders = await orderModel.find({}).populate('user' , '_id name email').populate('items.product','name price image_url')
        return res.json({orders})
    } catch (error) {
        const message = "error in getting all orders for admin 017"
        console.log(message,error)
        return res.status(500).json({
            message
        })
    }
}
exports.getMyOrder = async (req , res , next)=>{
     try {
        const orders = await orderModel.find({ user: req.user._id }).populate('items.product','name price image_url category brand')
        return res.json({
            orders
        })
    } catch (error) {
        const message = "error in fetching user orders 018"
        console.log(message,error)
        return res.status(500).json({
            message
        })
    }
}
exports.getOrderDetails = async (req , res , next)=>{
     try {
        const order = await orderModel.findById(req.params.id)
            .populate('user' , '_id name email')
            .populate('items.product','name price image_url category brand description')
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }
        // Secure access: only owner or admin can view details
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access to order details" })
        }
        return res.json({
            order
        })
    } catch (error) {
        const message = "error in fetching order details"
        console.log(message,error)
        return res.status(500).json({
            message
        })
    }
}
exports.createOrder = async (req , res , next)=>{
  try {
      const order = await orderModel.create({user:req.user._id ,...req.body})
      return res.json({message:"order created successfully", order})
    } catch (error) {
        const message = "error in order creating 019"
        console.log(message,error)
        return res.status(500).json({
            message
        })
    }
}
exports.updatetOrderStatus = async (req , res , next)=>{
  try {
        const order = await orderModel.findByIdAndUpdate(req.body._id ,{status:req.body.status},{returnDocument:'after'})
   return res.json({order,message:"order updates successfully"})
    } catch (error) {
        const message = "error in order updation 020"
        console.log(message,error)
        return res.status(500).json({
            message
        })
    }
}