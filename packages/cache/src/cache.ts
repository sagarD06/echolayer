import { getRedisClient } from "@echolayer/redis";

const redisClient = getRedisClient();

/* Function to get a value from the cache */
export async function CahceGet<T>(key: string): Promise<T | null> {
    try {
        const value = await redisClient.get(key);
        if (value) {
            return JSON.parse(value) as T;
        }
        return null;
    } catch (error) {
        console.error(`Error getting cache for key ${key}:`, error);
        return null;
    }
}

/* Function to set a value in the cache with a TTL (time to live) */
export async function CacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<T | null> {
    try {
        const stringValue = JSON.stringify(value);
        await redisClient.set(key, stringValue, 'EX', ttlSeconds);
        return value;
    } catch (error) {
        console.error(`Error setting cache for key ${key}:`, error);
        return null;
    }
}

/* Function to delete a value from the cache */
export async function CacheDelete<T>(key: string):Promise<boolean>{
    try {
        await redisClient.del(key);
        return true;
    } catch (error) {
        console.error(`Error deleting cache for key ${key}:`, error);
        return false;
    }
};