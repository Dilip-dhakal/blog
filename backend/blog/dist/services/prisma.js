import { PrismaPg } from "@prisma/adapter-pg";
// Step up out of services, out of src, out of blog, and into auth's generated folder
import { PrismaClient } from "../../../auth/generated/prisma/index.js";
import dotenv from "dotenv";
dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };
