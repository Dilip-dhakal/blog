import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const getEmailUser = () =>
  process.env.NODEMAILER_GMAIL || process.env.EMAIL_USER;

const getEmailPass = () => {
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  return pass?.replace(/\s/g, "");
};

const getTransporter = () => {
  const user = getEmailUser();
  const pass = getEmailPass();

  if (!user || !pass) {
    console.error("❌ Missing email credentials");
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  });
};

export const sendOtpEmail = async (email: string, code: string) => {
  const emailUser = getEmailUser();
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[DEV OTP] ${email} → ${code}`);
    return true;
  }

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Verify OTP",
    text: `Your OTP is ${code}`,
  };

  console.log("📧 Sending email to:", email);

  try {
    // 🔥 IMPORTANT: add timeout safeguard
    const sendPromise = transporter.sendMail(mailOptions);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SMTP timeout")), 8000)
    );

    const info = await Promise.race([sendPromise, timeoutPromise]);

    console.log("✅ EMAIL SENT:", (info as any).messageId);

    return true;
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err);
    return false;
  }
};