// emailHelper.ts
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing RESEND_API_KEY");
    return null;
  }
  return new Resend(apiKey);
};

export const sendOtpEmail = async (email: string, code: string) => {
  const resend = getResendClient();

  if (!resend) {
    console.log(`[DEV OTP] ${email} → ${code}`);
    return true;
  }

  console.log("📧 Sending email to:", email);

  try {
    const { data, error } = await resend.emails.send({
  from: "YourApp <onboarding@resend.dev>",
  to: email,
  subject: "Verify your email",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #111;">Verify your email</h2>
      <p style="color: #444; font-size: 15px;">Use the code below to verify your account. This code expires in 10 minutes.</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f5f5f5; padding: 16px; text-align: center; border-radius: 6px; margin: 20px 0;">
        ${code}
      </div>
      <p style="color: #999; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `,
  text: `Your verification code is ${code}. It expires in 10 minutes.`, // fallback for clients that don't render HTML
});

    if (error) {
      console.error("❌ EMAIL FAILED:", error);
      return false;
    }

    console.log("✅ EMAIL SENT:", data?.id);
    return true;
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err);
    return false;
  }
};