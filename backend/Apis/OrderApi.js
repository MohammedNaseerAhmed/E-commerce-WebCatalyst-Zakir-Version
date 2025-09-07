const exp=require('express')
const orderApp=exp.Router();
const orderModel=require('../Models/OrderModel')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const handler=require('express-async-handler')
orderApp.post('/order', authenticate, handler(async(req,res)=>{
    let p=req.body;
    let r=new orderModel({ ...p, userId: req.user.id });
    let r1=await r.save();
    res.status(201).send({message:"orders posted",payload:r1})
}))
orderApp.get('/orders', authenticate, handler(async(req,res)=>{
      let r=await orderModel.find({ userId: req.user.id })
    res.status(200).send({message:"getting orders",payload:r})
}))

orderApp.get("/orders/:userId", authenticate, handler(async (req, res) => {
    let { userId } = req.params;
    if (req.user.role === 'buyer' && req.user.id !== userId) return res.status(403).send({ message: 'Forbidden' })
    let orders = await orderModel.find({ userId }).populate("products.productId");
    res.status(200).send({ message: "Orders fetched", payload: orders });
}));


orderApp.put("/order/:orderId", authenticate, handler(async (req, res) => {
    let { orderId } = req.params;
    let updates = req.body; 
    let updatedOrder = await orderModel.findByIdAndUpdate(orderId, updates, { new: true });
    res.status(200).send({ message: "Order updated", payload: updatedOrder });
}));

orderApp.delete("/order/:orderId", authenticate, handler(async (req, res) => {
    let { orderId } = req.params;
    let deletedOrder = await orderModel.findByIdAndDelete(orderId);
    res.status(200).send({ message: "Order cancelled", payload: deletedOrder });
}));

module.exports=orderApp;