import express from 'express';
import blogRoutes from "./routes/blogRoute.js";
const app = express();
app.use(express.json());
app.use("/api/blog", blogRoutes);
export default app;
