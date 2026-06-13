import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig.js";
const generateToken = (data) => {
    const token = jwt.sign(data, envConfig.JWT_SECRET, {
        expiresIn: envConfig.JWT_EXPIRES_IN
    });
    return token;
};
export default generateToken;
