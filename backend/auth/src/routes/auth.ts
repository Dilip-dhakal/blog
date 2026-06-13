import express from 'express'
import registerUser from '../controllers/register.js'
import loginUser from '../controllers/login.js'
import upload from "../middleware/multerUpload.js"

const router=express.Router()



router.post("/register",upload.single("profilePicture"),registerUser)
router.post("/login",loginUser)


export default router