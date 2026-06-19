import express,{Application} from 'express'
import authRoutes from './routes/auth.js'
import cors from "cors";

const app:Application=express()

app.use(express.json())


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth",authRoutes)

export default app