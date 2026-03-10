import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const neonAdapter = new PrismaNeon({ connectionString: process.env.DATABASE_POOL_URL })

export const prisma = globalPrisma.prisma ?? new PrismaClient({ adapter: neonAdapter })

if (process.env.NODE_ENV !== "production") {
    globalPrisma.prisma = prisma;
}