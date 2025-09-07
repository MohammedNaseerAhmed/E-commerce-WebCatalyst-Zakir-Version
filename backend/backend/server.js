const exp=require('express')
const app=exp();
const buyerApp=require('./Apis/BuyerApi')
const productApp=require('./Apis/ProductApi')
app.use(exp.json())
const mongoose=require('mongoose');
const cors=require('cors');
const sellerApp = require('./Apis/SellerApi');
const cartApp = require('./Apis/CartApi');
const orderApp = require('./Apis/OrderApi');
const reviewApp = require('./Apis/ReviewApi');
app.use(cors())
require('dotenv').config()
const port=process.env.PORT || 4000;
mongoose.connect(process.env.URL)
.then(()=>{app.listen(port,()=>console.log(`server is listening on port ${port}..`))
        console.log("db connection is successful")
})
.catch(err=>{console.log("error in db connection ",err)})

app.use('/buyer-api',buyerApp)
app.use('/seller-api',sellerApp)
app.use('/product-api',productApp)
app.use('/cart-api',cartApp)
app.use('/order-api',orderApp)
app.use('/review-api',reviewApp)