"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLoginMutation } from "@/services/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ApiError } from "@/types/errorType";

export default function LoginPage() {
    const router = useRouter();
    const [login, { isLoading }] = useLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({ email: "", password: "" });
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
        try {
            await login(form).unwrap();
            // onQueryStarted in auth.api.ts sets the store
            router.push("/dashboard");
        } catch (err) {
            const error = err as ApiError;
            if (error?.data?.errors) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(error.data.errors).map(([k, v]) => [k, v[0]])
                    )
                );
            } else {
                toast.error(error?.data?.message ?? "Invalid email or password.");
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Welcome back
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Sign in to your EchoLayer account.
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
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        disabled={isLoading}
                    />
                    {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-xs text-violet-500 hover:text-violet-600 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Your password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            disabled={isLoading}
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword
                                ? <EyeOff className="w-4 h-4" />
                                : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white mt-1"
                    disabled={isLoading}
                >
                    {isLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Signing in…</>
                        : "Sign in"}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="/auth/register"
                    className="text-violet-500 hover:text-violet-600 font-medium transition-colors"
                >
                    Create one free
                </Link>
            </p>
        </motion.div>
    );
}