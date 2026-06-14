const orderModel = require("../models/orderModel")

exports.getAllOrders = async (req , res , next)=>{
    try {
        const orders = await orderModel.find({}).populate('user' , '_id name').populate('items.product','name price')
        return res.json({orders})
    } catch (error) {
        const message = "error in getting all orders for admin 017"
        console.log(message,error)
        return res.json({
            message
        })
    }
}
exports.getMyOrder = async (req , res , next)=>{
     try {
        const order = await orderModel.findById(req.body._id)
        return res.json({
            order
        })
    } catch (error) {
        const message = "error in fetching user order 018"
        console.log(message,error)
        return res.json({
            message
        })
    }
}
exports.createOrder = async (req , res , next)=>{
  try {
      await  orderModel.create({user:req.user._id ,...req.body})
     return res.json({message:"oreder created successfully"})
    } catch (error) {
        const message = "error in order creating 019"
        console.log(message,error)
        return res.json({
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
        return res.json({
            message
        })
    }
}
// exports.deleteOrders = async (req , res , next)=>{
//   try {
//          const order = await orderModel.findByIdAndDelete(req.body.id ,{returnDocument:'before'})
//    return res.json({order,message:"order deleted successfully"})
//     } catch (error) {
//         const message = "error in order deletion 021"
//         console.log(message,error)
//         return res.json({
//             message
//         })
//     }
// }