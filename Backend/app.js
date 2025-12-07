import express from 'express'
const app=express()
import usersRouter from './routes/auth.route.js'
import { PORT } from './config/env.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import connectTodatabase from './database/mongoose-connection.js'
import path from 'path'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import orderrouter from './routes/order.route.js'

connectTodatabase().then(()=>{
    console.log("Database connected successfully")
}).catch((e)=>{
    console.error("Database connection failed",e)
})
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))
app.use(express.json())
app.use(cookieparser())

app.use(express.urlencoded({extended:true}))
app.use('/api/v1/auth',usersRouter)
app.use('/api/v1/product',productRouter)
app.use('/api/v1/cart',cartRouter)
app.use('/api/v1/order',orderrouter)

app.listen(PORT)