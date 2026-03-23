import { Job } from "bullmq";
import type { SendPasswordResetEmailPayload } from "@echolayer/queues";
import { sendPasswordResetEmail } from "@echolayer/email";

export async function sendPasswordResetEmailProcessor(job: Job<SendPasswordResetEmailPayload>) {
    console.log(job.id, job.data.email)
    sendPasswordResetEmail(job.data.email, job.data.name, job.data.resetPasswordToken)
}