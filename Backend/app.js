const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./routes/authRoute')
const adminRouter = require('./routes/adminRoute')
const ProductRouter = require('./routes/productRoute')
const PaymentRouter = require('./routes/paymentRoute')
const OrderRouter = require('./routes/orderRoute')
const cartRouter = require('./routes/cartRoutes')
const favouritesRouter = require('./routes/favouritesRoutes')

 const app = express()
 app.use(cors({origin:process.env.FRONTEND_URL,credentials:true}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api/auth" ,authRouter )
app.use("/api/admin" ,adminRouter )
app.use("/api/product" ,ProductRouter )
app.use("/api/order" ,OrderRouter )
app.use("/api" , cartRouter)
app.use("/api" , favouritesRouter)
app.use("/api/payment" ,PaymentRouter )

 const PORT = process.env.PORT 
 mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Database connected successfully !!')
  app.listen(PORT , ()=>{
    console.log(`your server is running at http://localhost:${PORT}`)
 } )
 }).catch((err)=>{
    console.log("error in DB connection" , err)
 })
 