import { Request, Response } from "express";
import { prisma } from "../libs/prisma.js";
import { ErrorHandler } from "../errors/errorHandler.js";
import { sendOtpEmail } from "../utils/emailHelper.js";

const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ErrorHandler(400, "Email is required");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ErrorHandler(404, "No account found with this email");
  }

  if (user.verified) {
    throw new ErrorHandler(400, "This email is already verified");
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.otp.upsert({
    where: { email },
    update: { code: otpCode, expiresAt },
    create: { email, code: otpCode, expiresAt },
  });

  // DO NOT block request waiting for email
  sendOtpEmail(email, otpCode).catch((err) => {
    console.error("Failed to send OTP email:", err);
  });

  res.status(200).json({
    message: "A new verification code has been sent to your email",
    email,
  });
};

export default resendOtp;
