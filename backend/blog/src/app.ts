import express,{Application} from 'express'
import blogRoutes from "./routes/blogRoute.js"

const app:Application=express()

app.use(express.json())

app.use("/api/blog",blogRoutes)

export default app
