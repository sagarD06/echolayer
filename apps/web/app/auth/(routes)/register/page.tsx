"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRegisterMutation } from "@/services/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ApiError } from "@/types/errorType";

export default function RegisterPage() {
    const router = useRouter();
    const [register, { isLoading }] = useRegisterMutation();
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        organisationName: "",
    });

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
            await register(form).unwrap();
            toast.success("Account created! Check your email to verify your account.");
            router.push("/auth/login");
        } catch (err) {
            const error = err as ApiError;
            if (error?.data?.errors) {
                setErrors(
                    Object.fromEntries(
                        Object.entries(error.data.errors).map(([k, v]) => [k, v[0]])
                    )
                );
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
            <div className="mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Create your account
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Your account creates your organisation automatically.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="organisationName">Organisation name</Label>
                    <Input
                        id="organisationName"
                        name="organisationName"
                        placeholder="Acme Corp"
                        value={form.organisationName}
                        onChange={handleChange}
                        autoComplete="organization"
                        disabled={isLoading}
                    />
                    {errors.organisationName && (
                        <p className="text-xs text-destructive">{errors.organisationName}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Sagar D"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                        disabled={isLoading}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                </div>

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
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        disabled={isLoading}
                    />
                    {errors.phone && (
                        <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">Password</Label>
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
                        ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating account…</>
                        : "Create account"}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/auth/login"
                    className="text-violet-500 hover:text-violet-600 font-medium transition-colors"
                >
                    Sign in
                </Link>
            </p>

            <p className="mt-4 text-center text-xs text-muted-foreground">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                    Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                    Privacy Policy
                </Link>
                .
            </p>
        </motion.div>
    );
}