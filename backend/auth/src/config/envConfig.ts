import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const serviceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);

dotenv.config({
  path: path.join(serviceRoot, ".env"),
  override: true,
});

const envConfig = {
  PORT: process.env.PORT,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as number | undefined,
};

export default envConfig;
