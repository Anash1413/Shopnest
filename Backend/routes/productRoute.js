const express = require("express");
const multer = require("multer");
const { protect, IsAdmin } = require("../middlewares/protect");
const {
  getProductById,
  getProducts,
  createProduct,
  updateProductById,
  deleteProduct,
} = require("../controller/productController");
const ProductRouter = express.Router();
ProductRouter.use("/", multer({ dest: "uploads/" }).single("image_url"));
ProductRouter.route("/")
  .get(getProducts)
  .post(protect, IsAdmin, createProduct)
  .put(protect, IsAdmin, updateProductById)
  .delete(protect, IsAdmin, deleteProduct);
ProductRouter.get("/detail/:id", getProductById);
module.exports = ProductRouter;
