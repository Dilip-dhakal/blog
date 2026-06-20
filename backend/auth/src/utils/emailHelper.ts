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
      from: 'onboarding@resend.dev', // swap once domain is verified
      to: email,
      subject: "Verify OTP",
      text: `Your OTP is ${code}`,
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