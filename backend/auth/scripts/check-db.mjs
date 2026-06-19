import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env") });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

const users = await prisma.user.count();
const blogs = await prisma.blog.count();
const sample = await prisma.blog.findMany({
  take: 5,
  select: { id: true, title: true, createdAt: true },
  orderBy: { createdAt: "desc" },
});

console.log("DB host:", new URL(url).host);
console.log("Users:", users, "Blogs:", blogs);
console.log("Latest blogs:", sample);
await prisma.$disconnect();
