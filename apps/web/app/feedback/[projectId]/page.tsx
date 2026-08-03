"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FeedbackType = "IDEA" | "SUGGESTION" | "PROBLEM" | "QUESTION" | "PRAISE";

const FEEDBACK_TYPES: {
    value: FeedbackType;
    label: string;
    description: string;
    color: string;
    bg: string;
}[] = [
        {
            value: "PROBLEM",
            label: "Problem",
            description: "Something is broken or not working",
            color: "text-red-600 dark:text-red-400",
            bg: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30",
        },
        {
            value: "IDEA",
            label: "Idea",
            description: "A new feature or improvement",
            color: "text-violet-600 dark:text-violet-400",
            bg: "border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30",
        },
        {
            value: "SUGGESTION",
            label: "Suggestion",
            description: "Something that could be better",
            color: "text-blue-600 dark:text-blue-400",
            bg: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30",
        },
        {
            value: "PRAISE",
            label: "Praise",
            description: "Something you love",
            color: "text-green-600 dark:text-green-400",
            bg: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
        },
        {
            value: "QUESTION",
            label: "Question",
            description: "Something you need help with",
            color: "text-amber-600 dark:text-amber-400",
            bg: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
        },
    ];

export default function FeedbackPage() {
    const params = useParams();
    const projectId =
        typeof params?.projectId === "string"
            ? params.projectId
            : Array.isArray(params?.projectId)
                ? params.projectId[0] ?? ""
                : "";
    const searchParams = useSearchParams();
    const isEmbed = searchParams?.get("embed") === "true";

    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        type: "" as FeedbackType | "",
        title: "",
        content: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

    function validate() {
        const newErrors: Partial<Record<keyof typeof form, string>> = {};
        if (!form.type) newErrors.type = "Please select a feedback type.";
        if (!form.title.trim()) newErrors.title = "Title is required.";
        if (!form.content.trim()) newErrors.content = "Please describe your feedback.";
        if (form.content.trim().length < 10)
            newErrors.content = "Please provide a bit more detail (min 10 characters).";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/feedbacks/${projectId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: form.title.trim(),
                        content: form.content.trim(),
                        type: form.type,
                    }),
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.message ?? "Submission failed.");
            }

            setSubmitted(true);
        } catch (err: any) {
            toast.error(err.message ?? "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const selectedType = FEEDBACK_TYPES.find((t) => t.value === form.type);

    const wrapper = isEmbed
        ? "min-h-screen bg-background p-6 flex items-start justify-center"
        : "min-h-screen bg-background flex items-center justify-center p-6";

    return (
        <div className={wrapper}>
            <div className="w-full max-w-lg">
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* header */}
                            {!isEmbed && (
                                <div className="flex items-center gap-2.5 mb-8">
                                    <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                                        <MessageSquare className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-sm tracking-tight text-foreground">
                                        EchoLayer
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                                    Share your feedback
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                    Your response is anonymous. Tell us what you think — good or bad.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {/* type selector */}
                                <div className="flex flex-col gap-2">
                                    <Label>What kind of feedback is this?</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {FEEDBACK_TYPES.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => {
                                                    setForm((p) => ({ ...p, type: type.value }));
                                                    setErrors((p) => ({ ...p, type: undefined }));
                                                }}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all",
                                                    form.type === type.value
                                                        ? type.bg + " border-2"
                                                        : "border-border bg-card hover:bg-muted/40"
                                                )}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={cn(
                                                            "text-sm font-medium",
                                                            form.type === type.value
                                                                ? type.color
                                                                : "text-foreground"
                                                        )}
                                                    >
                                                        {type.label}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        {type.description}
                                                    </p>
                                                </div>
                                                <div
                                                    className={cn(
                                                        "w-4 h-4 rounded-full border-2 shrink-0 transition-all",
                                                        form.type === type.value
                                                            ? "border-current bg-current"
                                                            : "border-muted-foreground/40"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {errors.type && (
                                        <p className="text-xs text-destructive">{errors.type}</p>
                                    )}
                                </div>

                                {/* title */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="title">
                                        {selectedType
                                            ? `Summarize your ${selectedType.label.toLowerCase()}`
                                            : "Summary"}
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder={
                                            form.type === "PROBLEM"
                                                ? "e.g. Login button not working on mobile"
                                                : form.type === "IDEA"
                                                    ? "e.g. Add dark mode support"
                                                    : form.type === "PRAISE"
                                                        ? "e.g. The onboarding flow is excellent"
                                                        : "Short summary of your feedback"
                                        }
                                        value={form.title}
                                        onChange={(e) => {
                                            setForm((p) => ({ ...p, title: e.target.value }));
                                            setErrors((p) => ({ ...p, title: undefined }));
                                        }}
                                        disabled={isLoading}
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                {/* content */}
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="content">Details</Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Tell us more. The more detail you provide, the better we can understand and act on your feedback."
                                        value={form.content}
                                        onChange={(e) => {
                                            setForm((p) => ({ ...p, content: e.target.value }));
                                            setErrors((p) => ({ ...p, content: undefined }));
                                        }}
                                        disabled={isLoading}
                                        rows={5}
                                        className="resize-none"
                                    />
                                    <div className="flex items-center justify-between">
                                        {errors.content
                                            ? <p className="text-xs text-destructive">{errors.content}</p>
                                            : <span />}
                                        <span className="text-xs text-muted-foreground">
                                            {form.content.length} chars
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-violet-500 hover:bg-violet-600 text-white h-11"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</>
                                        : "Submit feedback"}
                                </Button>

                                <p className="text-center text-xs text-muted-foreground">
                                    Your feedback is anonymous. We never collect personal information.
                                </p>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center gap-5 py-12"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
                            >
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </motion.div>

                            <div>
                                <h2 className="text-2xl font-semibold text-foreground">
                                    Thank you!
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-xs mx-auto">
                                    Your feedback has been received. It helps us make things better for everyone.
                                </p>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSubmitted(false);
                                    setForm({ type: "", title: "", content: "" });
                                    setErrors({});
                                }}
                                className="mt-2"
                            >
                                Submit another
                            </Button>

                            {!isEmbed && (
                                <p className="text-xs text-muted-foreground">
                                    Powered by{" "}
                                    <span className="font-medium text-violet-500">EchoLayer</span>
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}