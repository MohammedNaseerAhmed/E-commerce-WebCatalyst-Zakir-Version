const exp = require("express");
const productApp = exp.Router();
const handler = require("express-async-handler");
const Product = require("../Models/ProductModel");
const { authenticate, authorizeRoles } = require('../middleware/auth')

require('dotenv').config()
const Groq = require('groq-sdk')
const groq = new Groq({apikey:process.env.GROQ_API_KEY})
productApp.post("/product", authenticate, authorizeRoles('seller'), handler(async (req, res) => {
    // let product = new Product(req.body); 
    // let savedProduct = await product.save();
    // res.status(201).send({ message: "Product created", payload: savedProduct });
     const {title,useGROQ,description,category,price,images,featured}=req.body;
    let finalDescription=description;
    if(useGROQ||(!finalDescription&&finalDescription.trim()==="")){
        const prompt = await groq.chat.completions.create({
            model:"llama-3.3-70b-versatile",
            messages:[
                {
                    role:"system",
                    content:"you are an AI that writes nice product description in about 10 words "
                },{
                    role:"user",
                    content:`write a short description on hand made products. product:${title},category:${category}`
                }
            ]
        })
        finalDescription = prompt.choices[0].message.content
    }
    //this if is beacuse when user doesnt give description but also doesnt let AI create a description
    if(!finalDescription){
        res.status(404).send({message:"either give description or let Ai create description"})
    }
    let product = new Product({userId: req.user.id, title,useGROQ,description:finalDescription,category,price,images,featured})
    const savedProduct = await product.save();
    res.status(201).send({message:"Product created",payload:savedProduct})
}));

productApp.get("/products", handler(async (req, res) => {
    let products = await Product.find().populate("userId", "fullname email");
    res.status(200).send({ message: "All products fetched", payload: products });
}));

productApp.get("/products/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let products = await Product.find({ userId });
    res.status(200).send({ message: "Products by seller fetched", payload: products });
}));

productApp.get("/product/:productId", handler(async (req, res) => {
    let { productId } = req.params;
    let product = await Product.findById(productId).populate("userId", "fullname email");
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product fetched", payload: product });
}));


productApp.put("/product/:productId", authenticate, authorizeRoles('seller'), handler(async (req, res) => {
    let { productId } = req.params;
    let updates = req.body;
    let updatedProduct = await Product.findOneAndUpdate({ _id: productId, userId: req.user.id }, updates, { new: true });
    if (!updatedProduct) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product updated successfully", payload: updatedProduct });
}));


productApp.delete("/product/:productId", authenticate, authorizeRoles('seller'), handler(async (req, res) => {
    let { productId } = req.params;
    let deletedProduct = await Product.findOneAndDelete({ _id: productId, userId: req.user.id });
    if (!deletedProduct) return res.status(404).send({ message: "Product not found" });
    res.status(200).send({ message: "Product deleted", payload: deletedProduct });
}));

module.exports = productApp;
