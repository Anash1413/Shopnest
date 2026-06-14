const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name : {type: String , required:true} ,
    price : {type: Number , required:true} ,
    description : {type: String , required:true} ,
    image_url : {type: String , required:true} ,
    category : {type: String , required:true} ,
    brand : {type: String , required:true} ,
    stock : {type: Number , required:true , default:0} ,
    rating : {type: Number } ,
    numReviews : {type: Number } ,
})
module.exports = mongoose.model('Product' , ProductSchema)