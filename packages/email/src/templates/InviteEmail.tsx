import {
    Button,
    Hr,
    Link,
    Section,
    Text,
} from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface Props {
    inviterName: string;
    organisationName: string;
    projectName: string;
    role: string;
    acceptUrl: string;
}

export function InviteEmail({
    inviterName,
    organisationName,
    projectName,
    role,
    acceptUrl,
}: Props) {
    return (
        <EmailLayout previewText={`${inviterName} invited you to join ${projectName} on EchoLayer`}>
            <Text style={greeting}>You've been invited 🎉</Text>

            <Text style={paragraph}>
                <strong>{inviterName}</strong> has invited you to join{" "}
                <strong>{projectName}</strong> as a{" "}
                <strong>{role.charAt(0) + role.slice(1).toLowerCase()}</strong> on{" "}
                <strong>{organisationName}</strong>.
            </Text>

            <Text style={paragraph}>
                EchoLayer helps teams collect and analyze product feedback. Click the
                button below to accept your invitation and set up your account.
            </Text>

            <Section style={buttonContainer}>
                <Button style={button} href={acceptUrl}>
                    Accept invitation
                </Button>
            </Section>

            <Hr style={divider} />

            <Text style={metaLabel}>Invited to</Text>
            <Text style={metaValue}>{projectName}</Text>

            <Text style={metaLabel}>Organisation</Text>
            <Text style={metaValue}>{organisationName}</Text>

            <Text style={metaLabel}>Your role</Text>
            <Text style={metaValue}>
                {role.charAt(0) + role.slice(1).toLowerCase()}
            </Text>

            <Hr style={divider} />

            <Text style={expiry}>
                This invitation expires in <strong>7 days</strong>. If you weren't
                expecting this, you can safely ignore this email.
            </Text>

            <Text style={fallbackLabel}>
                If the button doesn't work, copy and paste this link into your browser:
            </Text>
            <Link href={acceptUrl} style={fallbackLink}>
                {acceptUrl}
            </Link>
        </EmailLayout>
    );
}

// ── Styles ────────────────────────────────────────────────────
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
    margin: "0 0 16px 0",
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
    margin: "24px 0",
};

const metaLabel: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: "600",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 2px 0",
};

const metaValue: React.CSSProperties = {
    fontSize: "14px",
    color: "#111827",
    fontWeight: "500",
    margin: "0 0 12px 0",
};

const expiry: React.CSSProperties = {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.5",
    margin: "0 0 16px 0",
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