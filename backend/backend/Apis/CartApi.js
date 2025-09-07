const exp=require('express')
const cartApp=exp.Router();
const Cart=require('../Models/CartModel')
const handler=require('express-async-handler')
cartApp.post('/cart',handler(async(req,res)=>{
    let c=req.body;
    let c1=new Cart(c);
    let r=await c1.save();
    res.status(201).send({message:"posted succesfully",payload:r})
}));
cartApp.get('/carts',handler(async(req,res)=>{
    let r=await Cart.findOne({iscartActive:true})
    res.status(200).send({message:"getting carts",payload:r})
}));
cartApp.get("/cart/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).send({ message: "Cart not found" });
    res.status(200).send({ message: "Cart fetched", payload: cart });
}));
cartApp.put("/cart/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let updates = req.body;  
    let updatedCart = await Cart.findOneAndUpdate({ userId }, updates, { new: true });
    res.status(200).send({ message: "Cart updated", payload: updatedCart });
}));


cartApp.delete("/cart/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let deleted = await Cart.findOneAndDelete({ userId });
    res.status(200).send({ message: "Cart deleted", payload: deleted });
}));

module.exports=cartApp;