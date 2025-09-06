const exp = require("express");
const productApp = exp.Router();
const handler = require("express-async-handler");
const Product = require("../Models/ProductModel");

productApp.post("/product", handler(async (req, res) => {
    let product = new Product(req.body); 
    let savedProduct = await product.save();
    res.status(201).send({ message: "Product created", payload: savedProduct });
}));

productApp.get("/products", handler(async (req, res) => {
    let products = await Product.find().populate("sellerId", "fullname email");
    res.status(200).send({ message: "All products fetched", payload: products });
}));

productApp.get("/products/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let products = await Product.find({ userId });
    res.status(200).send({ message: "Products by seller fetched", payload: products });
}));

productApp.get("/product/:productId", handler(async (req, res) => {
    let { productId } = req.params;
    let product = await Product.findById(productId).populate("sellerId", "fullname email");
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product fetched", payload: product });
}));


productApp.put("/product/:productId", handler(async (req, res) => {
    let { productId } = req.params;
    let updates = req.body;
    let updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!updatedProduct) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product updated successfully", payload: updatedProduct });
}));


productApp.delete("/product/:productId", handler(async (req, res) => {
    let { productId } = req.params;
    let deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product deleted", payload: deletedProduct });
}));

module.exports = productApp;
