import express,{Request,Response,NextFunction} from 'express'
import {prisma} from "../libs/prisma.js"
import { ErrorHandler } from '../errors/errorHandler.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import generateToken from '../utils/generateToken.js'


const loginUser=async(req:Request,res:Response)=>{
    const{email,password}=req.body
    
    if(!email || !password){
        throw new ErrorHandler(400,"Email and password is required")
    }

    const isUserExists=await prisma.user.findUnique({
        where:{
            email:email
        }
    })

    if(!isUserExists){
        throw new ErrorHandler(404,"User with given email id doesnt exists")
    }

    const isMatch=await bcrypt.compare(password,isUserExists.hashedPassword)

    if(!isMatch){
        throw new ErrorHandler(401,"Invalid Credentials")
    }

    const token=generateToken({
        id:isUserExists.id,
        email:isUserExists.email
    })
    

    return res.status(200).json({
        message:"login successfull",
        data:{
            token,
            userName:isUserExists.name
        }
    })
}

export default loginUser