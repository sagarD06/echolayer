import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaNeon } from "@prisma/adapter-neon";

const globalPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }
    const pgAdapter = new PrismaPg({
        connectionString, max: 10,
        idleTimeoutMillis: 30000
    });
    return new PrismaClient({ adapter: pgAdapter });
}

export const prisma = globalPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalPrisma.prisma = prisma;
}