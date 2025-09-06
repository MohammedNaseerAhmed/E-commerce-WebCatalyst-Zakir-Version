const exp=require('express')
const orderApp=exp.Router();
const orderModel=require('../Models/OrderModel')
const handler=require('express-async-handler')
orderApp.post('/order',handler(async(req,res)=>{
    let p=req.body;
    let r=new orderModel(p);
    let r1=await r.save();
    res.status(201).send({message:"orders posted",payload:r1})
}))
orderApp.get('/orders',handler(async(req,res)=>{
      let r=await orderModel.findOne({isOrderActive:true})
    res.status(200).send({message:"getting orders",payload:r})
}))

orderApp.get("/orders/:userId", handler(async (req, res) => {
    let { userId } = req.params;
    let orders = await Order.find({ userId }).populate("products.productId");
    res.status(200).send({ message: "Orders fetched", payload: orders });
}));


orderApp.put("/order/:orderId", handler(async (req, res) => {
    let { orderId } = req.params;
    let updates = req.body; 
    let updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });
    res.status(200).send({ message: "Order updated", payload: updatedOrder });
}));

orderApp.delete("/order/:orderId", handler(async (req, res) => {
    let { orderId } = req.params;
    let deletedOrder = await Order.findByIdAndDelete(orderId);
    res.status(200).send({ message: "Order cancelled", payload: deletedOrder });
}));

module.exports=orderApp;