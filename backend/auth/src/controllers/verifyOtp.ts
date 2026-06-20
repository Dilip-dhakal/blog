import { Request, Response } from "express";
import { prisma } from "../libs/prisma.js";
import { ErrorHandler } from "../errors/errorHandler.js";
import generateToken from "../utils/generateToken.js";

const verifyOtp = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    throw new ErrorHandler(400, "Email and OTP code are required");
  }

  const otpRecord = await prisma.otp.findUnique({ where: { email } });

  if (!otpRecord) {
    throw new ErrorHandler(400, "No OTP verification active for this email");
  }

  if (otpRecord.code !== code) {
    throw new ErrorHandler(400, "Invalid verification code");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new ErrorHandler(400, "Verification code has expired");
  }

  // OTP is valid — NOW create the real user
  const user = await prisma.user.create({
    data: {
      name: otpRecord.name,
      email: otpRecord.email,
      hashedPassword: otpRecord.hashedPassword,
      profilePicture: otpRecord.profilePicture,
      verified: true,
    },
  });

  // OTP record no longer needed
  await prisma.otp.delete({ where: { email } });

  const token = generateToken({ id: user.id, email: user.email });

  res.status(200).json({
    message: "Email verified successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    },
  });
};

export default verifyOtp;