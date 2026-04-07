import React from "react";
import {
    Button,
    Link,
    Section,
    Text,
} from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface Props {
    name: string;
    verificationURL: string;
}

export function VerificationEmail({ name, verificationURL }: Props) {
    return (
        <EmailLayout previewText="Verify your EchoLayer email address">
            <Text style={greeting}>Hi {name},</Text>
            <Text style={paragraph}>
                Thanks for signing up for EchoLayer. Please verify your email address
                to activate your account and get started.
            </Text>

            <Section style={buttonContainer}>
                <Button style={button} href={verificationURL}>
                    Verify email address
                </Button>
            </Section>

            <Text style={expiry}>
                This link expires in <strong>24 hours</strong>. If you didn't create
                an EchoLayer account, you can safely ignore this email.
            </Text>

            <Text style={fallbackLabel}>
                If the button doesn't work, copy and paste this link into your browser:
            </Text>
            <Link href={verificationURL} style={fallbackLink}>
                {verificationURL}
            </Link>
        </EmailLayout>
    );
}

const greeting: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 12px 0",
};

const paragraph: React.CSSProperties = {
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.6",
    margin: "0 0 28px 0",
};

const buttonContainer: React.CSSProperties = {
    margin: "0 0 28px 0",
};

const button: React.CSSProperties = {
    backgroundColor: "#0f172a",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    padding: "14px 28px",
    textDecoration: "none",
    display: "inline-block",
};

const expiry: React.CSSProperties = {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.5",
    margin: "0 0 20px 0",
};

const fallbackLabel: React.CSSProperties = {
    fontSize: "12px",
    color: "#9ca3af",
    margin: "0 0 4px 0",
};

const fallbackLink: React.CSSProperties = {
    fontSize: "12px",
    color: "#6366f1",
    wordBreak: "break-all",
};