import "./config/envConfig.js";
import app from "./app.js";
import envConfig from "./config/envConfig.js";



const PORT=envConfig.PORT



app.listen(PORT,()=>{
    console.log(`Auth service is running on http://localhost:${PORT}`)
})