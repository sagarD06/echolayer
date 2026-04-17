"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/sidebar/side-bar";
import { Header } from "@/components/header/header";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetMeQuery } from "@/services/user.api";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isLoading, isError } = useGetMeQuery();

    useEffect(() => {
        if (isError) {
            // refresh token is also invalid — force re-login
            router.replace("/auth/login");
        }
    }, [isError, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen bg-background">
                {/* sidebar skeleton */}
                <div className="w-55 border-r border-border bg-card flex flex-col gap-4 p-4 shrink-0">
                    <Skeleton className="h-7 w-28 rounded-lg" />
                    <div className="flex flex-col gap-2 mt-4">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-9 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
                {/* content skeleton */}
                <div className="flex-1 flex flex-col">
                    <div className="h-14 border-b border-border bg-card px-6 flex items-center">
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex-1 p-6 flex flex-col gap-4">
                        <div className="grid grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-24 rounded-xl" />
                            ))}
                        </div>
                        <Skeleton className="h-64 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}