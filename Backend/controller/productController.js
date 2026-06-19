const  cloudinary  = require("../config/cloudinary")
const productModel = require("../models/productModel")
const fs = require('fs')

exports.getProducts = async (req ,res , next)=>{
      try {
        const products = await productModel.find()
        if(products){
            return res.json({products})
        }
      } catch (error) {
        console.log("error in fetching products  007",error)
        return res.json({message:"error in fetching products 007"})
      }
}
exports.getProductById = async ( req ,res , next)=>{
        try { 
        const product = await productModel.findById(req.params.id)
        if(product){
            return res.json({product})
        }
      } catch (error) {
        console.log("error in fetching product 008",error)
        return res.json({message:"error in fetching product 008"})
      }
}
exports.createProduct = async ( req ,res , next)=>{
        try { 
       const {name , price ,  description ,  category , brand , stock,rating,numReviews } = req.body
       let image_url=''
       if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path)
        image_url = result.secure_url
       fs.unlink(req.file.path,(err)=> console.log(" deleted uploaded file 011",err))
       }
       const product = await productModel.create({
        name,
        price,
        description,
        image_url,
        category,
        brand,
        stock, rating,numReviews
       })
       if(product){
         console.log(product)
        return res.json({message:"product created successfully"})
       }
      } catch (error) {
        const message = "error in creating product 009"
        console.log(message,error)
        return res.status(400).json({message:message, error: error.message})
      }
}
exports.updateProductById =async ( req ,res , next)=>{
        try { 
       const dataToUpdate = {...req.body}
       if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path)
        dataToUpdate.image_url = result.secure_url
         fs.unlink(req.file.path,(err)=> console.log("error in deletinh uploaded file 013",err))
       }
        const product = await productModel.findByIdAndUpdate(req.body.id,
        dataToUpdate,
        {
            returnDocument:'after'
        }
        )
        if(product){
            return res.json({product})
        }
      } catch (error) {
        const message = "error in updating product 010"
        console.log(message,error)
        return res.status(400).json({message:message, error: error.message})
      }
}

exports.deleteProduct = async ( req ,res , next)=>{
        try { 
         const id = req.params.id || req.body.id || req.query.id
         if (!id) {
           return res.status(400).json({ message: "Product ID is required for deletion" })
         }
         const product = await productModel.findByIdAndDelete(id)
         if (!product) {
           return res.status(404).json({ message: "Product not found" })
         }
         console.log("product deleted successfully:", id)
         return res.json({ message: "Product deleted successfully" })
      } catch (error) {
        const message = "error in deleting product 012"
        console.log(message,error)
        return res.status(400).json({message:message})
      }
    }