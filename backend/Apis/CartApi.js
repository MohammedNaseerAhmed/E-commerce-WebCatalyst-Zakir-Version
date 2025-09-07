const exp=require('express')
const cartApp=exp.Router();
const Cart=require('../Models/CartModel')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const handler=require('express-async-handler')
cartApp.post('/cart', authenticate, handler(async(req,res)=>{
    let c=req.body;
    // Ensure the cart is for the authenticated user (both buyers and sellers)
    let c1=new Cart({ ...c, userId: req.user.id });
    let r=await c1.save();
    res.status(201).send({message:"posted succesfully",payload:r})
}));
cartApp.get('/carts',handler(async(req,res)=>{
    let r=await Cart.findOne({iscartActive:true})
    res.status(200).send({message:"getting carts",payload:r})
}));
cartApp.get("/cart/:userId", authenticate, handler(async (req, res) => {
    let { userId } = req.params;
    // Allow users to fetch only their own cart (both buyers and sellers)
    if (req.user.id !== userId) return res.status(403).send({ message: "Forbidden" })
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).send({ message: "Cart not found" });
    res.status(200).send({ message: "Cart fetched", payload: cart });
}));
cartApp.put("/cart/:userId", authenticate, handler(async (req, res) => {
    let { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).send({ message: "Forbidden" })
    let updates = req.body;  
    let updatedCart = await Cart.findOneAndUpdate({ userId }, updates, { new: true });
    res.status(200).send({ message: "Cart updated", payload: updatedCart });
}));


cartApp.delete("/cart/:userId", authenticate, handler(async (req, res) => {
    let { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).send({ message: "Forbidden" })
    let deleted = await Cart.findOneAndDelete({ userId });
    res.status(200).send({ message: "Cart deleted", payload: deleted });
}));

module.exports=cartApp;