import { Job } from "bullmq";

import { SendInviteEmailPayload } from "@echolayer/queues";
import { sendInviteEmail } from "@echolayer/email";

export async function sendInviteEmailProcessor(job: Job<SendInviteEmailPayload>) {
    console.log(job.id, job.data.email);
    await sendInviteEmail(job.data.email, job.data.inviterName, job.data.organisationName, job.data.projectName, job.data.role, job.data.inviteToken);
}