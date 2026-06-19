import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const getEmailUser = () =>
  process.env.NODEMAILER_GMAIL || process.env.EMAIL_USER;

const getEmailPass = () => {
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  return pass?.replace(/\s/g, "");
};

const getTransporter = () => {
  const user = getEmailUser();
  const pass = getEmailPass();

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

export const sendOtpEmail = async (email: string, code: string) => {
  const emailUser = getEmailUser();
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Blog App" <${emailUser || "noreply.blogapp@gmail.com"}>`,
    to: email,
    subject: "Verify your email address - Blog App",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 8px; margin: 0 auto;">
        <h2 style="color: #6b21a8; text-align: center; margin-bottom: 20px;">Blog App Verification Code</h2>
        <p style="font-size: 16px; color: #333;">Thank you for signing up! Please use the following 6-digit verification code to complete your registration:</p>
        <div style="background-color: #f3e8ff; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 6px; color: #6b21a8; font-family: monospace;">${code}</span>
        </div>
        <p style="font-size: 14px; color: #666; line-height: 1.5;">This code will expire in 10 minutes. If you did not request this code, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #aaa; text-align: center;">© 2026 Blog App. All rights reserved.</p>
      </div>
    `,
  };

  if (!transporter) {
    console.log("\n=======================================");
    console.log(`[DEV OTP MODE] Target: ${email} | Code: ${code}`);
    console.log("=======================================\n");
    return;
  }

  await transporter.sendMail(mailOptions);
};
