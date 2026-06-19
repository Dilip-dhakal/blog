import express from 'express'
import registerUser from '../controllers/register.js'
import loginUser from '../controllers/login.js'
import verifyOtp from '../controllers/verifyOtp.js'
import resendOtp from '../controllers/resendOtp.js'
import upload from "../middleware/multerUpload.js"

const router=express.Router()



router.post("/register",upload.single("profilePicture"),registerUser)
router.post("/login",loginUser)
router.post("/verify-otp",verifyOtp)
router.post("/resend-otp",resendOtp)


export default router