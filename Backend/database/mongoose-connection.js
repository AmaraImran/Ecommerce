import mongoose from "mongoose";
import { MONGODB_URI,NODE_ENV } from "../config/env.js";
if(!MONGODB_URI){
    throw new Error("MONGODB_URI is not defined in environment variables");
}
const connectTodatabase=async()=>{
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Connected to MongoDB Database in ${NODE_ENV} mode`);
    } catch (e) {
     console.error("Failed to connect to MongoDB",e);   
     process.exit(1);
    }
}
export default connectTodatabase;