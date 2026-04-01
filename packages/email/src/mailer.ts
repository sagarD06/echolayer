import { jsx } from "react/jsx-runtime";
import { getResendClient } from "./client";
import { VerificationEmail } from "./templates/VerificationEmail";
import { ResetPasswordEmail } from "./templates/ResetPasswordEmail";
import { WelcomeEmail } from "./templates/WelcomeEmail";
import { InviteEmail } from "./templates/InviteEmail";

const FROM = "EchoLayer <no-reply@echolayer.com>";

/* Sends a verification email to the user */
export async function sendVerificationEmail(email: string, name: string, verificationToken: string) {
    const verificationURL = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;
    const { error } = await getResendClient().emails.send({
        from: FROM,
        to: email,
        subject: "Verify your email address",
        react: jsx(VerificationEmail, { name, verificationURL })
    })

    if (error) {
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
    }
};

/* Sends a password reset email to the user */
export async function sendPasswordResetEmail(email: string, name: string, resetPasswordToken: string) {

    const resetPasswordURL = `${process.env.APP_URL}/reset-password?token=${resetPasswordToken}`;

    const { error } = await getResendClient().emails.send({
        from: FROM,
        to: email,
        subject: "Reset your password",
        react: jsx(ResetPasswordEmail, { name, resetPasswordURL })
    })

    if (error) {
        console.error("Failed to send password reset email:", error);
        throw new Error("Failed to send password reset email");
    }
};

/* Sends a welcome email to the user after they have successfully signed up */
export async function sendWelcomeEmail(email: string, name: string, organisationName: string) {
    const { error } = await getResendClient().emails.send({
        from: FROM,
        to: email,
        subject: "Welcome to EchoLayer!",
        react: jsx(WelcomeEmail, { name, organisationName })
    })

    if (error) {
        console.error("Failed to send welcome email:", error);
        throw new Error("Failed to send welcome email");
    }
};

/* Sends a Invite Email to the user when they are invited to join an organisation */
export async function sendInviteEmail(email: string, name: string, organisationName: string, projectName: string, role: string, inviteToken: string) {
    const inviteUrl = `${process.env.APP_URL}/accept-invite?token=${inviteToken}`;

    const { error } = await getResendClient().emails.send({
        from: FROM,
        to: email,
        subject: `You've been invited to join ${organisationName} on EchoLayer!`,
        react: jsx(InviteEmail, { inviterName: name, organisationName, projectName, role, acceptUrl: inviteUrl })
    })

    if (error) {
        console.error("Failed to send invite email:", error);
        throw new Error("Failed to send invite email");
    }
}