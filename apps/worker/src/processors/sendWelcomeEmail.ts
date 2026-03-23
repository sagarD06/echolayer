import { Job } from "bullmq";
import type { SendWelcomeEmailPayload } from "@echolayer/queues";
import { sendWelcomeEmail } from "@echolayer/email";

export async function sendWelcomeEmailProcessor(job : Job<SendWelcomeEmailPayload>){
    console.log(job.id, job.data.email)
    sendWelcomeEmail(job.data.email, job.data.name, job.data.organizationName)
}