import { Request, Response } from "express";
import {prisma} from "../services/prisma.js"
import { AuthRequest } from "../middleware/isLoggedIn.js";

export default class Blog{
    static createBlog=async(req:AuthRequest,res:Response)=>{
        const {title,description}=req.body
        if(!title || !description){
            return res.status(400).json({
                message:"Title and description is required"
            })
        }

        const userId=req.userId
        console.log("USER ID:", req.userId);
        const blogFile=req.file ? req.file.path : null

        const blog=await prisma.blog.create({
            data:{
                title,
                description,
                blogFile,
                userId
            }
        })
        res.status(201).json({
            message:"Blog created successfully",
            blogId:blog.id,
            userId:userId
        })
    }

    static getAllBlog=async(req:Request,res:Response)=>{
        const fetchAllBlogs=await prisma.blog.findMany({
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            }
        })

        res.status(200).json({
            message:"All the blogs fetched successfully",
            fetchAllBlogs
        })
    }

    static getSingleBlog=async(req:Request,res:Response)=>{
        const blogId=req.params.id
        const fetchSingleBlog=await prisma.blog.findUnique({
            where:{
                id:blogId as string
            }
        })

        res.status(200).json({
            message:"Single blog fetched succesfully",
            fetchSingleBlog
        })
    }

    static getLoggedUserBlogs=async(req:AuthRequest,res:Response)=>{
        const userId=req.userId
        
        const fetchLoggedUserBlogs=await prisma.blog.findMany({
            where:{
                userId:userId
            }
        })

        res.status(200).json({
            message:"Logged User Dara Fetched successfully",
            fetchLoggedUserBlogs,
        })
    }

    static getOtherUserBlogs=async (req:Request,res:Response)=>{
        const blogs=await prisma.blog.findMany({
            where:{
                id:req.params.id as string
            }
        })

        res.status(200).json({
            message:"User data fetched successfully",
            blogs
        })
    }

    static updateBlog=async(req:AuthRequest,res:Response)=>{
        const blogId=req.params.id
        const {title,description}=req.body
        const blog=await prisma.blog.findUnique({
            where:{
                id:blogId as string
            }
        })

        if(!blog || !blogId){
            res.status(404).json({
                message:"Blog cannot be found"
            })
        }

        if(blog?.userId !== req.userId){
            res.status(400).json({
                message:"Unathorized access"
            })
        }

        const updatedBlog=await prisma.blog.update({
            where:{
                id:blogId as string
            },
            data:{
                title,
                description
            }
        })

        res.status(200).json({
            message:"Blog updated successfully",
            updatedBlog
        })
    }

    static deleteBlog=async(req:AuthRequest,res:Response)=>{
        const blogId=req.params.id
        const blog=await prisma.blog.findUnique({
            where:{
                id:blogId as string
            }
        })

        if(!blog || !blogId){
            res.status(404).json({
                message:"Blog cannot be found"
            })
        }

        if (blog?.userId !== req.userId) {
        return res.status(403).json({
            message: "You are not allowed to delete this blog"
        });
    }

    await prisma.blog.delete({
        where: {
            id: blogId as string
        }
    });

    return res.status(200).json({
        message: "Blog deleted successfully"
    });
};
}


