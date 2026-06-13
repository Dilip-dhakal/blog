import jwt from 'jsonwebtoken';
import envConfig from "../config/envConfig.js";
const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                message: "Unauthorized Access"
            });
        }
        const verification = jwt.verify(token, envConfig.JWT_SECRET);
        req.userId = verification.id;
        next();
    }
    catch (error) {
        console.log(`Error invalid token or expired token`, error);
    }
};
export default isLoggedIn;
