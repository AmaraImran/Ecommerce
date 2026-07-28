import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envName = process.env.NODE_ENV || "development";

config({
  path: [
    path.resolve(__dirname, `../.env.${envName}.local`),
    path.resolve(__dirname, "../.env.local"),
    path.resolve(__dirname, "../.env"),
  ],
});

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
