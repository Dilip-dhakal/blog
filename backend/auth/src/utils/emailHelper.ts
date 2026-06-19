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
    console.log(`[DEV MODE OTP] ${email} → ${code}`);
    return true;
  }

  const mailOptions = {
    from: `"Blog App" <${emailUser}>`,
    to: email,
    subject: "Verify your email - Blog App",
    html: `
      <div>
        <h2>OTP Code</h2>
        <h1>${code}</h1>
      </div>
    `,
  };

  try {
    console.log("📧 Sending email to:", email);

    // ✅ SIMPLE VERSION (NO TIMEOUT, NO RACE)
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);

    return true;
  } catch (err) {
    console.error("❌ Email failed:", err);
    return false;
  }
};