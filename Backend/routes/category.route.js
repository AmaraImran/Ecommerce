// routes/category.routes.js
import { Router } from "express";
const categoryrouter = Router();
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

// public routes
categoryrouter.get('/', getCategories);
categoryrouter.get('/all-categories', getCategories);
categoryrouter.get('/:id', getCategoryById);

// admin routes
categoryrouter.post('/create-category', verifyJWT, isAdmin, createCategory);
categoryrouter.patch('/update-category/:id', verifyJWT, isAdmin, updateCategory);
categoryrouter.delete('/delete-category/:id', verifyJWT, isAdmin, deleteCategory);

export default categoryrouter;