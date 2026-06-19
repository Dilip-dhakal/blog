import express,{Application} from 'express'
import authRoutes from './routes/auth.js'
import cors from "cors";
import nodemailer from "nodemailer";

const app:Application=express()

app.use(express.json())


app.use(
  cors({
    origin:[
      "http://localhost:3000",
      process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    ] ,
    credentials: true,
  })
);

app.get("/test-mail", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "If you see this, SMTP works",
    });

    res.json(info);
    res.send("Email sent successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

app.use("/api/auth",authRoutes)

export default app