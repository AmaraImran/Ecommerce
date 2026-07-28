import { Router } from "express";
const userrouter = Router();
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

userrouter.get("/me", verifyJWT, getProfile);
userrouter.patch("/me", verifyJWT, updateProfile);

export default userrouter;
