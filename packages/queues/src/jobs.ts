/* Job names for the queue */
export const JobName = {
    SEND_VERIFICATION_EMAIL: "send-verification-email",
    SEND_PASSWORD_RESET_EMAIL: "send-password-reset-email",
    SEND_WELCOME_EMAIL: "send-welcome-email",
    SEND_INVITE_EMAIL: "send-invite-email"
} as const

/* Type for job names */
export type JobName = (typeof JobName)[keyof typeof JobName]

/* Payload types for each job */
export interface SendVerificationEmailPayload {
    userId: string
    email: string
    name: string
    verificationToken: string
}

export interface SendPasswordResetEmailPayload {
    userId: string
    email: string
    name: string
    resetPasswordToken: string
}

export interface SendWelcomeEmailPayload {
    userId: string
    email: string
    name: string
    organizationName: string
}

export interface SendInviteEmailPayload {
    email: string;
    inviterName: string;
    organisationName: string;
    projectName: string;
    role: string;
    inviteToken: string;
}

/* Mapping of job names to their respective payload types */
export interface JobPayloadMap {
    [JobName.SEND_VERIFICATION_EMAIL]: SendVerificationEmailPayload
    [JobName.SEND_PASSWORD_RESET_EMAIL]: SendPasswordResetEmailPayload
    [JobName.SEND_WELCOME_EMAIL]: SendWelcomeEmailPayload
    [JobName.SEND_INVITE_EMAIL]: SendInviteEmailPayload
}