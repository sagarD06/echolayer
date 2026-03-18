import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";

interface EmailLayoutProps {
    children: React.ReactNode;
    previewText: string;
}

export function EmailLayout({ children, previewText }: EmailLayoutProps) {
    return (
        <Html lang="en">
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={body}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={logo}>EchoLayer</Text>
                        <Text style={tagline}>Feedback that drives action</Text>
                    </Section>

                    <Section style={content}>
                        {children}
                    </Section>

                    <Hr style={divider} />

                    <Section style={footer}>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} EchoLayer. All rights reserved.
                        </Text>
                        <Text style={footerSubText}>
                            You're receiving this email because you signed up for EchoLayer.
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
}

/* Styles */
const body: React.CSSProperties = {
    backgroundColor: "#f4f4f5",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    margin: 0,
    padding: 0,
};

const container: React.CSSProperties = {
    maxWidth: "560px",
    margin: "40px auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const header: React.CSSProperties = {
    backgroundColor: "#0f172a",
    padding: "28px 40px",
};

const logo: React.CSSProperties = {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.3px",
    margin: "0 0 2px 0",
};

const tagline: React.CSSProperties = {
    color: "#94a3b8",
    fontSize: "12px",
    margin: 0,
};

const content: React.CSSProperties = {
    padding: "36px 40px",
};

const divider: React.CSSProperties = {
    borderColor: "#f3f4f6",
    margin: "0 40px",
};

const footer: React.CSSProperties = {
    padding: "20px 40px 28px",
};

const footerText: React.CSSProperties = {
    color: "#9ca3af",
    fontSize: "12px",
    margin: "0 0 4px 0",
};

const footerSubText: React.CSSProperties = {
    color: "#d1d5db",
    fontSize: "11px",
    margin: 0,
};