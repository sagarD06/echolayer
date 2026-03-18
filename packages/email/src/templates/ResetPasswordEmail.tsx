import {
    Button,
    Hr,
    Link,
    Section,
    Text,
} from "@react-email/components";
import { EmailLayout } from "./EmailLayout";

interface Props {
    name: string;
    resetUrl: string;
}

export function ResetPasswordEmail({ name, resetUrl }: Props) {
    return (
        <EmailLayout previewText="Reset your EchoLayer password">
            <Text style={greeting}>Hi {name},</Text>
            <Text style={paragraph}>
                We received a request to reset the password for your EchoLayer account.
                Click the button below to choose a new password.
            </Text>

            <Section style={buttonContainer}>
                <Button style={button} href={resetUrl}>
                    Reset password
                </Button>
            </Section>

            <Text style={expiry}>
                This link expires in <strong>1 hour</strong>. After that you'll need
                to request a new one.
            </Text>

            <Hr style={divider} />

            <Text style={securityNotice}>
                If you didn't request a password reset, you can safely ignore this
                email. Your password will not change.
            </Text>

            <Text style={fallbackLabel}>
                If the button doesn't work, copy and paste this link into your browser:
            </Text>
            <Link href={resetUrl} style={fallbackLink}>
                {resetUrl}
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

const divider: React.CSSProperties = {
    borderColor: "#f3f4f6",
    margin: "0 0 20px 0",
};

const securityNotice: React.CSSProperties = {
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