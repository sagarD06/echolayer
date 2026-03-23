import { JobName } from "@echolayer/queues";
import { getRedisClient } from "@echolayer/redis";
import { Worker } from "bullmq";


/* Worker for processing verification email jobs */
export const verificationEmailWorker = new Worker(JobName.SEND_VERIFICATION_EMAIL, async (job) => { }, { connection: getRedisClient() })

verificationEmailWorker.on("completed", (job) => {
    console.log(`Job completed: ${job.id}`);
});
verificationEmailWorker.on("failed", (job, err) => {
    console.error(`Job failed: ${job?.id}`, err);
});
verificationEmailWorker.on("error", (err) => {
    console.error("Worker error:", err);
});

/* Worker for processing password reset email jobs */
export const passwordResetEmailWorker = new Worker(JobName.SEND_PASSWORD_RESET_EMAIL, async (job) => { }, { connection: getRedisClient() })

passwordResetEmailWorker.on("completed", (job) => {
    console.log(`Job completed: ${job.id}`);
});
passwordResetEmailWorker.on("failed", (job, err) => {
    console.error(`Job failed: ${job?.id}`, err);
});
passwordResetEmailWorker.on("error", (err) => {
    console.error("Worker error:", err);
});

/* Worker for processing welcome email jobs */
export const welcomeEmailWorker = new Worker(JobName.SEND_WELCOME_EMAIL, async (job) => { }, { connection: getRedisClient() })

welcomeEmailWorker.on("completed", (job) => {
    console.log(`Job completed: ${job.id}`);
});
welcomeEmailWorker.on("failed", (job, err) => {
    console.error(`Job failed: ${job?.id}`, err);
});
welcomeEmailWorker.on("error", (err) => {
    console.error("Worker error:", err);
});