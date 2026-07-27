import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

const normalizeCorsOrigins = (value) => {
  if (!value) {
    return ["http://localhost:5173"];
  }

  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const { PORT, NODE_ENV, MONGODB_URI, JWT_SECRET, CLOUDINARY_URL } = process.env;
export const origin = normalizeCorsOrigins(process.env.origin || process.env.CORS_ORIGIN);
