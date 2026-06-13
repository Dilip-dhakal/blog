import { v2 as cloudinary } from "cloudinary";
import envConfig from "../config/envConfig.js";
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
    cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
    api_key: envConfig.CLOUDINARY_API_KEY,
    api_secret: envConfig.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log("file:", req.file);
        return {
            folder: "blog",
            allowed_formats: ["jpg", "png", "jpeg"],
            public_id: file.fieldname + "-" + Date.now()
        };
    },
});
export { storage, cloudinary };
