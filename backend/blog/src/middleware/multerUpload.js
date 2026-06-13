import multer from "multer";
import { storage } from "../services/cloudinaryConfig.js";
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
