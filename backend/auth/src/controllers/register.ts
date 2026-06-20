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

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser && existingUser.verified) {
    throw new ErrorHandler(409, "User with the given email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let user;
  if (existingUser) {
    user = await prisma.user.update({
      where: { email },
      data: {
        name,
        hashedPassword,
        profilePicture,
        verified: false,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        profilePicture,
        verified: false,
      },
    });
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  await prisma.otp.upsert({
    where: { email },
    update: { code: otpCode, expiresAt },
    create: { email, code: otpCode, expiresAt },
  });

  const emailSent = await sendOtpEmail(email, otpCode);

  res.status(200).json({
    message: emailSent
      ? "OTP verification code sent to your email"
      : "Account created, but we couldn't send the OTP email. Please request a new code.",
    email: user.email,
    emailSent,
  });
};

export default registerUser;