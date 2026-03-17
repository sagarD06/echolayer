import Redis from "ioredis";

let client: Redis | null = null;
export function getRedisClient(): Redis {
    if (!client) {
        client = new Redis({
            host: process.env.REDIS_HOST ?? "localhost",
            port: Number(process.env.REDIS_PORT ?? 6379),
            password: process.env.REDIS_PASSWORD ?? undefined,
            maxRetriesPerRequest: null,
        });
    }

    client.on("error", (err) => {
        console.error("[Redis] Connection error:", err);
    });

    client.on("connect", () => {
        console.log("[Redis] Connected");
    });

    return client;
}