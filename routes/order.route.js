import { Router } from "express";
const orderrouter = Router();
import { cancelOrder, getAllOrders, getOrderById, getUserOrders, placeOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
orderrouter.get('/all-orders',verifyJWT,isAdmin,getAllOrders)
orderrouter.get('/',verifyJWT,getUserOrders)
orderrouter.get('/user-orders',verifyJWT,getUserOrders)
orderrouter.post('/place-order',verifyJWT,placeOrder)
orderrouter.get('/:id',verifyJWT,getOrderById)
orderrouter.patch('/update-status/:id',verifyJWT,isAdmin,updateOrderStatus)
orderrouter.patch('/cancel-order/:id',verifyJWT,cancelOrder)
export default orderrouter;
