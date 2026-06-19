import express from 'express'
import isLoggedIn from '../middleware/isLoggedIn.js'
import upload from '../middleware/multerUpload.js'
import Blog from '../controllers/blog.controller.js'
import createBlog from '../controllers/blog.controller.js'

const router=express.Router()


router.post("/",isLoggedIn,upload.single("blogFile"),Blog.createBlog)
router.get("/stats",Blog.getBlogStats)
router.get("/",Blog.getAllBlog)
router.get("/user/me",isLoggedIn,Blog.getLoggedUserBlogs)
router.get("/:id",Blog.getSingleBlog)
router.get("/users/:id/blogs",isLoggedIn,Blog.getOtherUserBlogs)
router.patch("/update/:id",isLoggedIn,Blog.updateBlog)
router.delete("/delete/:id",isLoggedIn,Blog.deleteBlog)



export default router