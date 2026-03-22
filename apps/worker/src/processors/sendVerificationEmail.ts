import { Job } from "bullmq";
import type { SendVerificationEmailPayload } from "@echolayer/queues";
import { sendVerificationEmail } from "@echolayer/email";

export async function sendVerificationEmailProcessor(job: Job<SendVerificationEmailPayload>) {

    console.log(job.id, job.data.email)

    sendVerificationEmail(job.data.name, job.data.email, job.data.verificationToken)
};