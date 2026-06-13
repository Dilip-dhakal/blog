import cloudinary from '../utils/cloudinaryConfig.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
// import Express from 'express';
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "blog/profiles", // ← maybe change folder name
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
            cb(new Error("Only jpeg, png and jpg is allowed"));
        }
    },
    limits: {
        fileSize: 4 * 1024 * 1024 // 4MB
    }
});
export default upload;
