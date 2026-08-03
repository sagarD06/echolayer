"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/Auth.store";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

type State = "loading" | "success" | "error" | "auth-required";

export default function AcceptInvitePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get("token");
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    const [state, setState] = useState<State>("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setState("error");
            setErrorMessage("Invalid invite link — no token found.");
            return;
        }

        async function acceptInvite() {
            try {
                const headers: HeadersInit = {
                    "Content-Type": "application/json",
                };

                // if authenticated, include access token
                const accessToken = useAuthStore.getState().accessToken;
                if (accessToken) {
                    headers["Authorization"] = `Bearer ${accessToken}`;
                }

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/invites/accept-invite`,
                    {
                        method: "POST",
                        headers,
                        credentials: "include",
                        body: JSON.stringify({ token }),
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    // if 401 and not authenticated — prompt login first
                    if (res.status === 401 && !isAuthenticated) {
                        setState("auth-required");
                        return;
                    }
                    throw new Error(data?.message ?? "Failed to accept invite.");
                }

                setState("success");

                // redirect to dashboard after short delay
                setTimeout(() => {
                    router.push("/dashboard");
                }, 2500);
            } catch (err: any) {
                setState("error");
                setErrorMessage(err.message ?? "Something went wrong.");
            }
        }

        acceptInvite();
    }, [token, isAuthenticated, router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* logo */}
                <div className="flex items-center justify-center gap-2.5 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm tracking-tight text-foreground">
                        EchoLayer
                    </span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center gap-5"
                >
                    {/* loading */}
                    {state === "loading" && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center">
                                <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Accepting invite…
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1.5">
                                    Verifying your invite token. This will only take a moment.
                                </p>
                            </div>
                        </>
                    )}

                    {/* success */}
                    {state === "success" && (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center"
                            >
                                <CheckCircle2 className="w-7 h-7 text-green-500" />
                            </motion.div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Invite accepted!
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1.5">
                                    You now have access to the project. Redirecting you to the
                                    dashboard…
                                </p>
                            </div>
                            <Button
                                className="bg-violet-500 hover:bg-violet-600 text-white"
                                onClick={() => router.push("/dashboard")}
                            >
                                Go to dashboard
                            </Button>
                        </>
                    )}

                    {/* error */}
                    {state === "error" && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                <XCircle className="w-7 h-7 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Invite failed
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1.5">
                                    {errorMessage}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    The invite may have expired or already been used. Ask your
                                    team admin to send a new one.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                asChild
                            >
                                <Link href="/">Back to home</Link>
                            </Button>
                        </>
                    )}

                    {/* needs auth first */}
                    {state === "auth-required" && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center">
                                <MessageSquare className="w-7 h-7 text-violet-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Sign in to accept
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                    You need to be signed in to accept this invite. Sign in or
                                    create an account, then return to this link.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <Button
                                    className="w-full bg-violet-500 hover:bg-violet-600 text-white"
                                    asChild
                                >
                                    <Link
                                        href={`/auth/login?next=/invite/accept?token=${token}`}
                                    >
                                        Sign in
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link
                                        href={`/auth/register?next=/invite/accept?token=${token}`}
                                    >
                                        Create account
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}