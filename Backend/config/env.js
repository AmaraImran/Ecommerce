import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const {PORT,NODE_ENV,MONGODB_URI,JWT_SECRET,CLOUDINARY_URL} = process.env;
