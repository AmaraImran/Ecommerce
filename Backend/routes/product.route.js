import { Router } from "express";
const productRouter=Router()
import { createProduct, deleteProductById, getAllProducts, getProductById, updateProduct } from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

productRouter.post('/create-product',verifyJWT,isAdmin,upload.single('image'),createProduct)
productRouter.get('/',getAllProducts)
productRouter.get('/:id',getProductById)
productRouter.delete('/:id',deleteProductById)
productRouter.patch('/:id',upload.single('image'),updateProduct)
export default productRouter;