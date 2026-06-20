import { Request, Response } from "express";
import { prisma } from "../libs/prisma.js";
import { ErrorHandler } from "../errors/errorHandler.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../utils/emailHelper.js";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ErrorHandler(
      400,
      "All the fields are required(name,email and password)",
    );
  }

  const profilePicture = req.file
    ? req.file.path
    : "https://thumbs.dreamstime.com/b/profile-anonymous-face-icon-gray-silhouette-person-male-default-avatar-photo-placeholder-isolated-white-background-profile-107327860.jpg";

  // Block only if a VERIFIED user already owns this email
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new ErrorHandler(409, "User with the given email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Store pending signup details on the OTP record — NOT in user table yet
  await prisma.otp.upsert({
    where: { email },
    update: { code: otpCode, expiresAt, name, hashedPassword, profilePicture },
    create: { email, code: otpCode, expiresAt, name, hashedPassword, profilePicture },
  });

  const emailSent = await sendOtpEmail(email, otpCode);

  res.status(200).json({
    message: emailSent
      ? "OTP verification code sent to your email"
      : "Couldn't send the OTP email. Please request a new code.",
    email,
    emailSent,
  });
};

export default registerUser;