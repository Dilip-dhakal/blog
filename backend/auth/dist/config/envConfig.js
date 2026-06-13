import dotenv from 'dotenv';
dotenv.config();
const envConfig = {
    PORT: process.env.PORT,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
};
export default envConfig;
