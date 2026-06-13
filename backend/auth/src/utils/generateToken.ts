import jwt from "jsonwebtoken"
import { IGenerateTokenData } from "../types/tokenData.js"
import envConfig from "../config/envConfig.js"




const generateToken=(data:IGenerateTokenData)=>{
    const token=jwt.sign(data,envConfig.JWT_SECRET! as string,{
        expiresIn:envConfig.JWT_EXPIRES_IN
    })

    return token
}

export default generateToken