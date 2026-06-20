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

// emailHelper.ts
export const sendOtpEmail = async (
  email: string,
  code: string,
): Promise<boolean> => {
  const resend = getResendClient();

  if (!resend) {
    console.log(`[DEV OTP] ${email} → ${code}`);
    return true;
  }

  console.log("📧 Sending email to:", email);

  try {
    const { data, error } = await resend.emails.send({
      from: "Typora <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to Typora — Verify your email",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
          <h1 style="color: #111; font-size: 22px; margin-bottom: 8px;">Welcome to Typora 👋</h1>
          <p style="color: #555; font-size: 15px; line-height: 1.5;">
            Thanks for signing up! Use the verification code below to confirm your email address.
          </p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; background: #f5f5f7; color: #111; padding: 18px; text-align: center; border-radius: 8px; margin: 24px 0;">
            ${code}
          </div>
          <p style="color: #888; font-size: 13px;">
            This code will expire in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #aaa; font-size: 12px;">Typora — your space to write.</p>
        </div>
      `,
      text: `Welcome to Typora! Your verification code is ${code}. It expires in 10 minutes.`,
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