import nodemailer, { SentMessageInfo } from "nodemailer";
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
    console.error("❌ Missing email credentials in environment variables");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

export const sendOtpEmail = async (email: string, code: string) => {
  const emailUser = getEmailUser();
  const transporter = getTransporter();

  // DEV MODE (no email config)
  if (!transporter) {
    console.log("\n=======================================");
    console.log(`[DEV OTP MODE] Email: ${email} | OTP: ${code}`);
    console.log("=======================================\n");
    return true;
  }

  const mailOptions = {
    from: `"Blog App" <${emailUser}>`,
    to: email,
    subject: "Verify your email address - Blog App",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Blog App Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="letter-spacing: 6px;">${code}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    console.log("📧 Sending OTP to:", email);

    const info: SentMessageInfo = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.messageId);

    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
};