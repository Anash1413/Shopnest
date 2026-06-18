const userModel = require("../models/userModel")

exports.getCart = async (req, res , next)=>{
  try {
      const user = await userModel.findById(req.user._id).select('cart').populate('cart')
      return res.json({cart: user.cart})
  } catch (error) {
    const message = ' error in getting cart '
    console.log(message,error)
    return res.status(400).json({message})
  }
}

exports.addToCart = async (req , res , next) =>{
    try {
        await userModel.findByIdAndUpdate(req.user._id,
             { $addToSet: { cart: req.body } },
             {returnDocument:'after'})
        return res.json({message : "Product added to cart successfully!"})
    } catch (error) {
        const message = ' error in adding cart '
    console.log(message,error)
    return res.status(400).json({message})
    }
}
exports.deleteFromCart = async (req , res , next) =>{
    try {
       const cart = await userModel.findByIdAndUpdate(req.user._id, {$pull:{cart:req.body._id}},{returnDocument:'before'})
        return res.json({cart:cart.cart, message : "Product deleted from cart successfully!"})
    } catch (error) {
        const message = ' error in deleting cart '
    console.log(message,error)
    return res.status(400).json({message})
    }
}