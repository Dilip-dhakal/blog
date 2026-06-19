import express,{Application} from 'express'
import authRoutes from './routes/auth.js'
import cors from "cors";

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

app.use("/api/auth",authRoutes)

export default app