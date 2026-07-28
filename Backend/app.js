import express from 'express'
const app=express()
import usersRouter from './routes/auth.route.js'
import { PORT, origin } from './config/env.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import connectTodatabase from './database/mongoose-connection.js'
import path from 'path'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import orderrouter from './routes/order.route.js'
import categoryRouter from './routes/category.route.js'
import userRouter from './routes/user.route.js'
connectTodatabase().then(()=>{
    console.log("Database connected successfully")
}).catch((e)=>{
    console.error("Database connection failed",e)
})
const allowedOrigins = Array.isArray(origin) ? origin : [origin]
app.use(cors({
  origin:["http://localhost:5173",
    "https://ecommercefrontend-wheat-five.vercel.app"],
    credentials:true,
}))
console.log("CORS allowed origins:", allowedOrigins);
app.use(express.json())
app.use(cookieparser())

app.use(express.urlencoded({extended:true}))
app.use('/api/v1/auth',usersRouter)
app.use('/api/v1/product',productRouter)
app.use('/api/v1/cart',cartRouter)
app.use('/api/v1/order',orderrouter)
app.use("/api/v1/category",categoryRouter)
app.use("/api/v1/user",userRouter)

app.listen(PORT)
export default app;