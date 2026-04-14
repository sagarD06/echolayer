"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

import { Spotlight } from "@/components/ui/spotlight";

const FEATURES = [
    { icon: "◈", label: "Anonymous feedback collection" },
    { icon: "◉", label: "Widget, link & QR code sharing" },
    { icon: "◎", label: "AI-powered feedback analysis" },
    { icon: "◇", label: "Multi-tenant team management" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="relative hidden lg:flex flex-col overflow-hidden bg-[#0d1117]">
                <Spotlight
                    className="-top-40 left-0 md:left-20 md:-top-20"
                    fill="#8b5cf6"
                />

                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px),
                            linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                        backgroundSize: "48px 48px",
                    }}
                />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full px-10 py-10">

                    <Link href="/" className="flex items-center gap-2.5 w-fit">
                        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-semibold text-base tracking-tight">
                            EchoLayer
                        </span>
                    </Link>


                    <div className="flex-1 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-violet-400 text-sm font-medium tracking-widest uppercase mb-4">
                                Feedback, reimagined
                            </p>
                            <h1 className="text-4xl font-semibold text-white leading-[1.15] tracking-tight">
                                Hear what your
                                <br />
                                users{" "}
                                <span className="text-violet-400">actually</span>
                                <br />
                                think.
                            </h1>
                            <p className="mt-5 text-[#8b949e] text-sm leading-relaxed max-w-sm">
                                EchoLayer gives your team a single place to capture, triage,
                                and act on user feedback — without the noise.
                            </p>
                        </motion.div>


                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-10 flex flex-col gap-3"
                        >
                            {FEATURES.map((f, i) => (
                                <motion.div
                                    key={f.label}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.08 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-violet-400 text-base leading-none">{f.icon}</span>
                                    <span className="text-[#8b949e] text-sm">{f.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>


                    <p className="text-[#30363d] text-xs">
                        © {new Date().getFullYear()} EchoLayer. All rights reserved.
                    </p>
                </div>
            </div>


            <div className="flex flex-col items-center justify-center px-6 py-12 bg-background min-h-screen lg:min-h-0">

                <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
                    <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-semibold text-sm">EchoLayer</span>
                </Link>

                <div className="w-full max-w-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}