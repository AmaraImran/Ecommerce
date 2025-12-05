import { Router } from "express";
const cartRouter=Router()

import { addToCart, clearCart, getUserCart, removeFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

cartRouter.post('/addtocart',verifyJWT,addToCart)
cartRouter.delete('/removefromcart',verifyJWT,removeFromCart)
cartRouter.patch('/update-quantity',verifyJWT,updateQuantity)
cartRouter.get('/',verifyJWT,getUserCart)
cartRouter.delete('/clear-cart',verifyJWT,clearCart)
export default cartRouter;