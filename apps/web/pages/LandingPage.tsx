"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/home/Navbar";
import PricingCard from "@/components/home/PricingCard";
import DashboardPreview from "@/components/home/DashboardPreview";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FEATURES, PRICING, STEPS, TESTIMONIALS } from "@/mock/mockdata_homepage";

import { cn } from "@/lib/utils";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { BackgroundLines } from "@/components/ui/background-lines";
import { SparklesCore } from "@/components/ui/sparkles";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const LandingPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"], // tracks only while hero is in view
    });
    const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
    const heroY = useTransform(heroScroll, [0, 1], [0, -60]);

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-foreground">
            <Navbar />
            <section id="hero" ref={heroRef} className="relative overflow-hidden">
                <BackgroundLines className="absolute inset-0 opacity-30" svgOptions={{ duration: 10 }}>
                    <span />
                </BackgroundLines>
                <div className="absolute inset-x-0 top-0 h-64 pointer-events-none">
                    <SparklesCore
                        background="transparent"
                        minSize={0.4}
                        maxSize={1.2}
                        particleDensity={40}
                        className="w-full h-full"
                        particleColor="#8b5cf6"
                    />
                </div>

                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-12 text-center"
                >
                    <motion.div
                        initial={{ opacity: 1, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge
                            variant="outline"
                            className="mb-6 border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300 gap-1.5"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                            Now in public beta
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08 }}
                        className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.12] text-foreground"
                    >
                        Collect feedback.
                        <br />
                        <span className="text-violet-500">Act on what matters.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.16 }}
                        className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
                    >
                        EchoLayer helps your team capture, organize, and understand user feedback — with
                        widgets, links, and QR codes that work anywhere your customers are.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.24 }}
                        className="mt-8 flex items-center justify-center gap-3 flex-wrap"
                    >
                        <Button
                            size="lg"
                            className="bg-violet-500 hover:bg-violet-600 text-white gap-2 h-11"
                            asChild
                        >
                            <Link href="/auth/register">
                                Start for free <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-11" asChild>
                            <Link href="#how-it-works">See how it works</Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-5 flex items-center justify-center gap-3"
                    >
                        <div className="flex -space-x-2">
                            {["#8b5cf6", "#3b82f6", "#22c55e", "#f59e0b"].map((c, i) => (
                                <div
                                    key={i}
                                    className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-medium text-white"
                                    style={{ background: c }}
                                >
                                    {["AK", "MR", "SP", "TL"][i]}
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground">Trusted by 200+ product teams</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                    >
                        <DashboardPreview />
                    </motion.div>
                </motion.div>
            </section>

            <section id="features" className="py-24 bg-muted/30">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <Badge
                            variant="outline"
                            className="mb-4 border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        >
                            Features
                        </Badge>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Everything you need to close the feedback loop
                        </h2>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto leading-relaxed">
                            From collection to resolution — EchoLayer handles the full lifecycle so your team
                            can focus on building.
                        </p>
                    </div>

                    <HoverEffect
                        items={FEATURES.map((f) => ({
                            title: f.title,
                            description: f.description,
                            link: "/",
                            icon: (
                                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", f.iconBg)}>
                                    {f.icon}
                                </div>
                            ),
                        }))}
                        className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    />
                </div>
            </section>

            <section id="how-it-works" className="py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <Badge
                            variant="outline"
                            className="mb-4 border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        >
                            How it works
                        </Badge>
                        <h2 className="text-3xl font-semibold tracking-tight">Up and running in minutes</h2>
                        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                            Four steps from signup to your first piece of feedback.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
                        {/* connector line */}
                        <div className="hidden md:block absolute top-9 left-[calc(12.5%+18px)] right-[calc(12.5%+18px)] h-px bg-border" />

                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center px-4 relative"
                            >
                                <div className="w-9 h-9 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm font-semibold mb-4 z-10 relative">
                                    {step.num}
                                </div>
                                <p className="text-sm font-medium text-foreground mb-1.5">{step.title}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="pricing" className="py-24 bg-muted/30">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <Badge
                            variant="outline"
                            className="mb-4 border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        >
                            Pricing
                        </Badge>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Simple, transparent pricing
                        </h2>
                        <p className="mt-3 text-muted-foreground">Start free. Scale when you&apos;re ready.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {PRICING.map((tier) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <PricingCard tier={tier} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="testimonials" className="py-24 overflow-hidden">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <Badge
                            variant="outline"
                            className="mb-4 border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300"
                        >
                            Testimonials
                        </Badge>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Teams that shipped faster with EchoLayer
                        </h2>
                        <p className="mt-3 text-muted-foreground">Real feedback from real product teams.</p>
                    </div>
                </div>

                <InfiniteMovingCards
                    items={TESTIMONIALS.map((t) => ({
                        quote: t.quote,
                        name: t.name,
                        title: t.role,
                    }))}
                    direction="left"
                    speed="slow"
                    pauseOnHover={true}
                    className="py-4"
                />
            </section>

            <section className="py-24 bg-muted/30">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Ready to hear what your users think?
                        </h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            Set up your first project in minutes. No credit card required.
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                            <Button
                                size="lg"
                                className="bg-violet-500 hover:bg-violet-600 text-white gap-2 h-11"
                                asChild
                            >
                                <Link href="/auth/register">
                                    Start for free <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-11" asChild>
                                <Link href="/auth/login">Sign in</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer className="border-t border-border/50 py-8">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-violet-500 flex items-center justify-center">
                            <MessageSquare className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold">EchoLayer</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {["Privacy", "Terms", "Docs", "GitHub"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} EchoLayer. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;