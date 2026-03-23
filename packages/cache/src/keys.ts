/* This file defines the cache keys used in the application. Each key is a function that takes an identifier (like userId or orgId) and returns a string that can be used as a key in the cache. This helps to ensure consistency in how cache keys are generated throughout the application. */

export const Cachekeys = {
    user: (userId: string) => `cache:user:${userId}`,
    org: (orgId: string) => `cache:org:${orgId}`,
} as const;