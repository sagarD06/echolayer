/* This file defines the Time To Live (TTL) values for different types of cache entries. TTL is the duration (in seconds) that a cache entry is considered valid before it is expired and removed from the cache. The TTL values are defined as constants to ensure consistency across the application when setting cache expiration times. */

export const TTL = {
    USER: 60 * 15, // 15 minutes
    ORG: 60 * 60, // 1 hour
    ORG_MEMBERS: 60 * 15, // 15 minutes
    PROJECT: 60 * 30, // 30 minutes
    PROJECT_MEMBERS: 60 * 15, // 15 minutes — shorter than project since membership changes more frequently
} as const;