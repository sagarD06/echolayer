import { Queue } from "bullmq";
import { JobName, JobPayloadMap } from "./jobs";
import { getRedisClient } from "@echolayer/redis";

const queues = new Map<string, Queue>();

export function getQueues<T extends JobName>(name: T): Queue<JobPayloadMap[T]> {
    if (!queues.has(name)) {
        queues.set(name, new Queue<JobPayloadMap[T]>(name, {
            connection: getRedisClient(),
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 2000
                },
                removeOnComplete: { count: 100 },
                removeOnFail: { count: 500 }
            },
        }))
    }

    return queues.get(name) as Queue<JobPayloadMap[T]>;
}