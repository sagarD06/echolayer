import React from "react";
import {
    Button,
    Hr,
    Section,
    Text,
} from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface Props {
    name: string;
    organisationName: string;
}

export function WelcomeEmail({ name, organisationName }: Props) {
    const dashboardUrl = `${process.env.APP_URL}/dashboard`;

    return (
        <EmailLayout previewText={`Welcome to EchoLayer, ${name}`}>
            <Text style={greeting}>Welcome aboard, {name} 👋</Text>
            <Text style={paragraph}>
                Your organisation <strong>{organisationName}</strong> is all set up on
                EchoLayer. You're ready to start collecting feedback that actually
                drives action.
            </Text>

            <Text style={subheading}>Here's what you can do next:</Text>

            <Text style={listItem}>→ Create your first project</Text>
            <Text style={listItem}>→ Invite your team members</Text>
            <Text style={listItem}>→ Share your feedback widget</Text>

            <Section style={buttonContainer}>
                <Button style={button} href={dashboardUrl}>
                    Go to dashboard
                </Button>
            </Section>

            <Hr style={divider} />

            <Text style={closing}>
                If you have any questions, reply to this email — we're happy to help.
            </Text>
        </EmailLayout>
    );
}

const greeting: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 16px 0",
};

const paragraph: React.CSSProperties = {
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
};

const subheading: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 10px 0",
};

const listItem: React.CSSProperties = {
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.5",
    margin: "0 0 6px 0",
    paddingLeft: "4px",
};

const buttonContainer: React.CSSProperties = {
    margin: "28px 0",
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

const divider: React.CSSProperties = {
    borderColor: "#f3f4f6",
    margin: "0 0 20px 0",
};

const closing: React.CSSProperties = {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.5",
    margin: 0,
};