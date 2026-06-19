import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/index.js";
import envConfig from "../config/envConfig.js";

if (!envConfig.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Check backend/auth/.env");
}

const adapter = new PrismaPg({ connectionString: envConfig.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export { prisma };
