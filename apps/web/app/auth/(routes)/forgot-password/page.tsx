"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useForgotPasswordMutation } from "@/services/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import type { ApiError } from "@/types/errorType";

export default function ForgotPasswordPage() {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setEmailError("");
        try {
            await forgotPassword({ email }).unwrap();
            setSubmitted(true);
        } catch (err) {
            const error = err as ApiError;
            if (error?.data?.errors?.email) {
                setEmailError(error.data.errors.email[0]!);
            } else {
                toast.error(error?.data?.message ?? "Something went wrong. Please try again.");
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <AnimatePresence mode="wait">
                {!submitted ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                Forgot your password?
                            </h2>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Enter your email and we&apos;ll send a reset link. It may take a moment to arrive.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError("");
                                    }}
                                    autoComplete="email"
                                    disabled={isLoading}
                                />
                                {emailError && (
                                    <p className="text-xs text-destructive">{emailError}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-violet-500 hover:bg-violet-600 text-white mt-1"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending…</>
                                    : "Send reset link"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to sign in
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center gap-4 py-6"
                    >
                        <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                            <MailCheck className="w-7 h-7 text-violet-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                We&apos;ve sent a password reset link to{" "}
                                <span className="text-foreground font-medium">{email}</span>.
                                It may take a minute or two to arrive.
                            </p>
                        </div>
                        <Link
                            href="/auth/login"
                            className="mt-2 inline-flex items-center gap-1.5 text-sm text-violet-500 hover:text-violet-600 font-medium transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to sign in
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}