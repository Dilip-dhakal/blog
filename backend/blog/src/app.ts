import express,{Application} from 'express'
import blogRoutes from "./routes/blogRoute.js"
import cors from "cors";


const app:Application=express()

app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use("/api/blog",blogRoutes)

export default app
