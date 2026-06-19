import nodemailer, { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const getEmailUser = () =>
  process.env.NODEMAILER_GMAIL || process.env.EMAIL_USER;

const getEmailPass = () => {
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;
  return pass?.replace(/\s/g, "");
};

// ✅ FIXED SMTP CONFIG (IMPORTANT)
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
    console.log(`[DEV MODE OTP] ${email} → ${code}`);
    return true;
  }

  const mailOptions = {
    from: `"Blog App" <${emailUser}>`,
    to: email,
    subject: "Verify your email - Blog App",
    html: `
      <div style="font-family: Arial; padding:20px;">
        <h2>Verification Code</h2>
        <h1 style="letter-spacing:6px">${code}</h1>
        <p>Expires in 10 minutes</p>
      </div>
    `,
  };

  try {
    console.log("📧 Sending email to:", email);

    // ✅ TIMEOUT WRAPPER (PREVENT HANGING)
    const info: SentMessageInfo = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), 10000)
      ),
    ]);

    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email failed:", err);

    // IMPORTANT: don't block registration
    return false;
  }
};