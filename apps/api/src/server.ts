import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import app from "./app";

import { getRedisClient } from "@echolayer/redis";
import { prisma } from "@echolayer/database";

const PORT = 5000;

async function startServer() {
    getRedisClient();
    await prisma.$connect();
    console.log("[DB] Prisma connected");

    const server = app.listen(PORT, () => {
        console.log(`🚀 API running on http://localhost:${PORT}`);
    });

    process.on("SIGTERM", async () => {
        console.log("[Server] Shutting down...");
        server.close();
        await prisma.$disconnect();
        process.exit(0);
    });

    process.on("SIGINT", async () => {
        console.log("[Server] Shutting down...");
        server.close();
        await prisma.$disconnect();
        process.exit(0);
    });
}

startServer();