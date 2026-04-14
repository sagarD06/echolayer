"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useResetPasswordMutation } from "@/services/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { ApiError } from "@/types/errorType";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get("token") ?? "";

    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [done, setDone] = useState(false);

    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<Partial<typeof form>>({});

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token. Please request a new link.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match." });
            return;
        }

        try {
            await resetPassword({ token, ...form }).unwrap();
            setDone(true);
        } catch (err) {
            const error = err as ApiError;
            if (error?.data?.errors) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(error.data.errors).map(([k, v]) => [k, v[0]])
                    )
                );
            } else {
                toast.error(
                    error?.data?.message ?? "Reset link may have expired. Please request a new one."
                );
            }
        }
    }

    if (!token) {
        return (
            <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                    Invalid reset link.{" "}
                    <Link href="/auth/forgot-password" className="text-violet-500 hover:text-violet-600">
                        Request a new one
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <AnimatePresence mode="wait">
                {!done ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                Set a new password
                            </h2>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Choose a strong password for your account.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="password">New password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={form.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="confirmPassword">Confirm password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Re-enter your password"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((p) => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-violet-500 hover:bg-violet-600 text-white mt-1"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Resetting…</>
                                    : "Reset password"}
                            </Button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center text-center gap-4 py-6"
                    >
                        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Password updated</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Your password has been reset successfully. You can now sign in.
                            </p>
                        </div>
                        <Button
                            className="mt-2 bg-violet-500 hover:bg-violet-600 text-white"
                            onClick={() => router.push("/auth/login")}
                        >
                            Go to sign in
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}