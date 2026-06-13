import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "../services/cloudinaryConfig.js";
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        console.log("file:", file);
        return {
            folder: "blog/blogs",
            allowed_formats: ["jpg", "png", "jpeg"],
            public_id: file.fieldname + "-" + Date.now()
        };
    },
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Only jpeg,png and jpg is allowed"));
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});
export default upload;
