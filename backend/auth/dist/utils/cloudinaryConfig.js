import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params:async (req:Express.Request,file:Express.Multer.File)=> {
//     console.log("file:", req.file)
//     return{
//         folder: "blog/profiles",
//         allowed_formats: ["jpg", "png", "jpeg"],
//         public_id:file.fieldname + "-" + Date.now()
//     }
//   },
// });
export default cloudinary;
