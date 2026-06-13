import { prisma } from "../libs/prisma.js";
import { ErrorHandler } from '../errors/errorHandler.js';
import bcrypt from 'bcrypt';
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ErrorHandler(400, "All the fields are required(name,email and password)");
    }
    const profilePicture = req.file
        ? req.file.path
        : "https://thumbs.dreamstime.com/b/profile-anonymous-face-icon-gray-silhouette-person-male-default-avatar-photo-placeholder-isolated-white-background-profile-107327860.jpg";
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if (existingUser) {
        throw new ErrorHandler(409, "User with the given email lready exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword,
            profilePicture
        }
    });
    res.status(201).json({
        message: "User created successfully",
        data: user.name
    });
};
export default registerUser;
