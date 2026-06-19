const orderModel = require("../models/orderModel")
const productModel = require("../models/productModel")
const userModel = require("../models/userModel")

exports.adminAnalytics = async (req , res , next) => {
    try
{
    const totalUsers = await userModel.countDocuments({role:"user"})
    const totalorders = await orderModel.countDocuments()
    const totalproducts = await productModel.countDocuments()
    const orders = await orderModel.find({})
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount , 0)
    return res.json({totalRevenue,totalproducts,totalUsers,totalorders})
}
 catch (error) 
{
        const message = "error in adminAnalytics 023"
        console.log(message, error)
        return res.json({message})
}
}