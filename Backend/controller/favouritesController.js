const userModel = require("../models/userModel")

exports.getFavourites = async (req, res , next)=>{
  try {
      const user = await userModel.findById(req.user._id).select('favourites').populate('favourites')
      return res.json({favourites: user.favourites})
  } catch (error) {
    const message = ' error in getting favourites '
    console.log(message,error)
    return res.status(400).json({message})
  }
}

exports.addToFavourites = async (req , res , next) =>{
    try {
        await userModel.findByIdAndUpdate(req.user._id,
             { $addToSet: { favourites: req.body.productId } },
             {returnDocument:'after'})
        return res.json({message : "Product added to favourites successfully!"})
    } catch (error) {
        const message = ' error in adding to favourites '
    console.log(message,error)
    return res.status(400).json({message})
    }
}
exports.deleteFromFavourites = async (req , res , next) =>{
    try {
        await userModel.findByIdAndUpdate(req.user._id, {$pull:{favourites:req.body.productId}},{returnDocument:'after'})
        return res.json({message : "Product deleted from favourites successfully!"})
    } catch (error) {
        const message = ' error in deleting from favourites '
    console.log(message,error)
    return res.status(400).json({message})
    }
}
