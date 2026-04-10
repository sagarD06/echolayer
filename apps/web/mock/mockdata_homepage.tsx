import { Download, Layers, QrCode, ShieldCheck, Sparkles, Zap } from "lucide-react";

export interface FeedbackItem {
    type: "Problem" | "Idea" | "Praise" | "Suggestion" | "Question";
    text: string;
    status: "Open" | "Planned" | "In progress" | "Completed";
}

export interface PricingTier {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    featured?: boolean;
}

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    initials: string;
    color: string;
}

export const FEEDBACK_ITEMS: FeedbackItem[] = [
    {
        type: "Problem",
        text: "Checkout flow breaks on mobile Safari when applying discount codes",
        status: "In progress",
    },
    {
        type: "Idea",
        text: "Would love a dark mode option — using it at night is rough on the eyes",
        status: "Planned",
    },
    {
        type: "Praise",
        text: "Onboarding is incredibly smooth. Got up and running in under 10 minutes.",
        status: "Completed",
    },
    {
        type: "Suggestion",
        text: "CSV export would help us share results with stakeholders easily",
        status: "Open",
    },
];

export const FEATURES = [
    {
        title: "Flexible collection",
        description:
            "Embed a widget, share a link, or generate a QR code — meet your customers wherever they are, with zero friction.",
        icon: <QrCode className="w-5 h-5" />,
        iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
    },
    {
        title: "Anonymous by default",
        description:
            "Customers share honestly when they know their identity is protected. No login, no tracking — just real feedback.",
        icon: <ShieldCheck className="w-5 h-5" />,
        iconBg: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    },
    {
        title: "Multi-tenant organisations",
        description:
            "Invite your team, assign roles, manage multiple projects — all scoped to your organisation with fine-grained access control.",
        icon: <Layers className="w-5 h-5" />,
        iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
        title: "Status lifecycle",
        description:
            "Move feedback from Open → Planned → In Progress → Completed and keep every stakeholder aligned without a meeting.",
        icon: <Zap className="w-5 h-5" />,
        iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    },
    {
        title: "AI analysis",
        description:
            "Hit Analyze and get an instant summary of what's working and what needs your attention — no manual tagging required.",
        icon: <Sparkles className="w-5 h-5" />,
        iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
    },
    {
        title: "Export anytime",
        description:
            "Download all project feedback as CSV for reporting, archiving, or piping into any external tool your team already uses.",
        icon: <Download className="w-5 h-5" />,
        iconBg: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    },
];

export const STEPS = [
    {
        num: "01",
        title: "Create your org",
        desc: "Sign up, name your organisation, and invite your team in under two minutes.",
    },
    {
        num: "02",
        title: "Add a project",
        desc: "Create a project per product, feature, or campaign. No limit on Pro.",
    },
    {
        num: "03",
        title: "Share the link",
        desc: "Embed the widget, copy the link, or drop a QR code anywhere.",
    },
    {
        num: "04",
        title: "Close the loop",
        desc: "Triage, track status, and use AI to surface what actually matters.",
    },
];

export const PRICING: PricingTier[] = [
    {
        name: "Starter",
        price: "Free",
        period: "forever",
        description: "Perfect for solo founders and small teams just getting started.",
        features: [
            "1 project",
            "Up to 100 feedbacks / month",
            "Widget + shareable link",
            "Up to 3 team members",
            "Basic status tracking",
        ],
        cta: "Get started free",
    },
    {
        name: "Pro",
        price: "$29",
        period: "per month",
        description: "For growing teams who need more projects and AI-powered insights.",
        features: [
            "Unlimited projects",
            "Unlimited feedbacks",
            "Widget + link + QR code",
            "AI analyze",
            "CSV export",
            "Up to 15 team members",
            "Priority support",
        ],
        cta: "Start free trial",
        featured: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "pricing",
        description: "For large teams with advanced security and compliance requirements.",
        features: [
            "Everything in Pro",
            "SSO / SAML",
            "Dedicated support",
            "Custom integrations",
            "Unlimited team members",
            "SLA guarantee",
        ],
        cta: "Talk to sales",
    },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote:
            "We replaced a messy spreadsheet and three Slack channels with EchoLayer. The AI summary alone saves us hours every sprint.",
        name: "Anika Rao",
        role: "Head of Product, Fyntech",
        initials: "AR",
        color: "bg-violet-500",
    },
    {
        quote:
            "The QR code feature is a game changer. We print them at events and get real-time feedback — no app install required.",
        name: "James Mwangi",
        role: "CTO, Loopbase",
        initials: "JM",
        color: "bg-blue-500",
    },
    {
        quote:
            "Setup took 8 minutes. I embedded the widget, shared it with beta users, and had 40 responses before lunch.",
        name: "Sofia Petrov",
        role: "Founder, Draftly",
        initials: "SP",
        color: "bg-green-500",
    },
    {
        quote:
            "Finally a feedback tool that doesn't require customers to create an account. Adoption went through the roof.",
        name: "Ravi Menon",
        role: "PM, Stackwise",
        initials: "RM",
        color: "bg-amber-500",
    },
    {
        quote:
            "The role-based access is exactly what we needed. Devs see what they need, stakeholders see what they need.",
        name: "Clara Hoffmann",
        role: "Engineering Lead, Bravo",
        initials: "CH",
        color: "bg-pink-500",
    },
];