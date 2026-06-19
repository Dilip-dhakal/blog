var _a;
import { prisma } from "../services/prisma.js";
import jwt from "jsonwebtoken";
class Blog {
}
_a = Blog;
Blog.createBlog = async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description is required",
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
            userId,
        },
    });
    res.status(201).json({
        message: "Blog created successfully",
        createBlog: blog,
    });
};
Blog.getBlogStats = async (_req, res) => {
    const [totalBlogs, viewsAgg, writers] = await Promise.all([
        prisma.blog.count(),
        prisma.blog.aggregate({ _sum: { views: true } }),
        prisma.blog.groupBy({ by: ["userId"] }),
    ]);
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
    res.status(200).json({
        message: "Blog stats fetched successfully",
        stats: {
            totalBlogs,
            totalViews: viewsAgg._sum.views ?? 0,
            totalWriters: writers.length,
        },
    });
};
Blog.getAllBlog = async (req, res) => {
    const { search, page: pageQuery, limit: limitQuery } = req.query;
    const page = Math.max(1, parseInt(pageQuery, 10) || 1);
    const limit = Math.min(24, Math.max(1, parseInt(limitQuery, 10) || 9));
    const skip = (page - 1) * limit;
    const whereClause = search
        ? {
            title: {
                contains: search,
                mode: "insensitive",
            },
        }
        : {};
    const [fetchAllBlogs, total] = await Promise.all([
        prisma.blog.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                description: true,
                blogFile: true,
                views: true,
                createdAt: true,
                user: {
                    select: { id: true, name: true },
                },
            },
        }),
        prisma.blog.count({ where: whereClause }),
    ]);
    res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
    res.status(200).json({
        message: "All the blogs fetched successfully",
        fetchAllBlogs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
};
Blog.getSingleBlog = async (req, res) => {
    const blogId = req.params.id;
    if (!blogId) {
        return res.status(400).json({ message: "Blog ID is required" });
    }
    const blogExists = await prisma.blog.findUnique({
        where: { id: blogId },
    });
    if (!blogExists) {
        return res.status(404).json({ message: "Blog not found" });
    }
    // Extract client IP and optional logged-in user details to prevent duplication spam
    const xForwardedFor = req.headers["x-forwarded-for"];
    const ipAddress = (Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor) || req.socket.remoteAddress || "unknown-ip";
    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "thisisthejwtsecretkeywhichshouldbbbeesecret");
            userId = decoded.id;
        }
        catch (err) {
            // Suppress and continue as guest
        }
    }
    const cooldownPeriod = new Date(Date.now() - 15 * 60 * 1000); // 15 mins cooldown
    const orFilters = [{ ipAddress }];
    if (userId) {
        orFilters.push({ userId });
    }
    const duplicateView = await prisma.blogView.findFirst({
        where: {
            blogId: blogId,
            createdAt: { gte: cooldownPeriod },
            OR: orFilters,
        },
    });
    if (!duplicateView) {
        await prisma.$transaction([
            prisma.blogView.create({
                data: {
                    blogId: blogId,
                    ipAddress,
                    userId,
                },
            }),
            prisma.blog.update({
                where: { id: blogId },
                data: {
                    views: { increment: 1 },
                },
            }),
        ]);
    }
    const fetchSingleBlog = await prisma.blog.findUnique({
        where: {
            id: blogId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePicture: true,
                },
            },
        },
    });
    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
    res.status(200).json({
        message: "Single blog fetched succesfully",
        fetchSingleBlog,
    });
};
Blog.getLoggedUserBlogs = async (req, res) => {
    const userId = req.userId;
    const { page: pageQuery, limit: limitQuery } = req.query;
    const page = Math.max(1, parseInt(pageQuery, 10) || 1);
    const limit = Math.min(24, Math.max(1, parseInt(limitQuery, 10) || 9));
    const skip = (page - 1) * limit;
    const where = { userId };
    const [fetchUserBlogs, total] = await Promise.all([
        prisma.blog.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                description: true,
                blogFile: true,
                views: true,
                createdAt: true,
            },
        }),
        prisma.blog.count({ where }),
    ]);
    res.status(200).json({
        message: "Logged User Data Fetched successfully",
        fetchUserBlogs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
};
Blog.getOtherUserBlogs = async (req, res) => {
    const blogs = await prisma.blog.findMany({
        where: {
            id: req.params.id,
        },
    });
    res.status(200).json({
        message: "User data fetched successfully",
        blogs,
    });
};
Blog.updateBlog = async (req, res) => {
    const blogId = req.params.id;
    const { title, description } = req.body;
    const blog = await prisma.blog.findUnique({
        where: {
            id: blogId,
        },
    });
    if (!blog || !blogId) {
        return res.status(404).json({
            message: "Blog cannot be found",
        });
    }
    if (blog?.userId !== req.userId) {
        res.status(400).json({
            message: "Unathorized access",
        });
    }
    const updatedBlog = await prisma.blog.update({
        where: {
            id: blogId,
        },
        data: {
            title,
            description,
        },
    });
    res.status(200).json({
        message: "Blog updated successfully",
        updateBlog: updatedBlog,
    });
};
Blog.deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    const blog = await prisma.blog.findUnique({
        where: {
            id: blogId,
        },
    });
    if (!blog || !blogId) {
        res.status(404).json({
            message: "Blog cannot be found",
        });
    }
    if (blog?.userId !== req.userId) {
        return res.status(403).json({
            message: "You are not allowed to delete this blog",
        });
    }
    await prisma.blog.delete({
        where: {
            id: blogId,
        },
    });
    return res.status(200).json({
        message: "Blog deleted successfully",
    });
};
export default Blog;
