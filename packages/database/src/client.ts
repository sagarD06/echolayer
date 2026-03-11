import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaNeon } from "@prisma/adapter-neon";

const globalPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const pgAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const prisma = globalPrisma.prisma ?? new PrismaClient({ adapter: pgAdapter })

if (process.env.NODE_ENV !== "production") {
    globalPrisma.prisma = prisma;
}