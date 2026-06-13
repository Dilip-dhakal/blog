var _a;
import { prisma } from "../services/prisma.js";
class Blog {
}
_a = Blog;
Blog.createBlog = async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description is required"
        });
    }
    const userId = req.userId;
    console.log("USER ID:", req.userId);
    const blogFile = req.file ? req.file.path : null;
    const blog = await prisma.blog.create({
        data: {
            title,
            description,
            blogFile,
            userId
        }
    });
    res.status(201).json({
        message: "Blog created successfully",
        blogId: blog.id,
        userId: userId
    });
};
Blog.getAllBlog = async (req, res) => {
    const fetchAllBlogs = await prisma.blog.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    res.status(200).json({
        message: "All the blogs fetched successfully",
        fetchAllBlogs
    });
};
Blog.getSingleBlog = async (req, res) => {
    const blogId = req.params.id;
    const fetchSingleBlog = await prisma.blog.findUnique({
        where: {
            id: blogId
        }
    });
    res.status(200).json({
        message: "Single blog fetched succesfully",
        fetchSingleBlog
    });
};
Blog.getLoggedUserBlogs = async (req, res) => {
    const userId = req.userId;
    const fetchLoggedUserBlogs = await prisma.blog.findMany({
        where: {
            userId: userId
        }
    });
    res.status(200).json({
        message: "Logged User Dara Fetched successfully",
        fetchLoggedUserBlogs,
    });
};
Blog.getOtherUserBlogs = async (req, res) => {
    const blogs = await prisma.blog.findMany({
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({
        message: "User data fetched successfully",
        blogs
    });
};
export default Blog;
