"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    ChevronLeft,
    MessageSquare,
    LogOut,
    ChevronRight,
} from "lucide-react";

import { useSidebarStore } from "@/store/Sidebar.store";
import { useAuthStore } from "@/store/Auth.store";
import { cn } from "@/lib/utils";

import { useLogoutMutation } from "@/services/auth.api";

const NAV_ITEMS = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
    },
    {
        label: "Projects",
        href: "/projects",
        icon: FolderKanban,
        exact: false,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        exact: false,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const { collapsed, toggle } = useSidebarStore();
    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    const [logout] = useLogoutMutation();

    async function handleLogout() {
        try {
            await logout().unwrap();
            router.push("/auth/login");
        } catch {
            toast.error("Failed to logout. Please try again.");
        }
    }

    function isActive(href: string, exact: boolean) {
        return exact ? pathname === href : pathname?.startsWith(href);
    }

    return (
        <motion.aside
            animate={{ width: collapsed ? 64 : 220 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative flex flex-col h-screen bg-card border-r border-border shrink-0 overflow-hidden"
        >
            {/* Logo */}
            <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="font-semibold text-sm tracking-tight whitespace-nowrap overflow-hidden"
                            >
                                EchoLayer
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors group relative",
                                active
                                    ? "bg-violet-500/10 text-violet-500"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-4 h-4 shrink-0 transition-colors",
                                    active ? "text-violet-500" : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="whitespace-nowrap overflow-hidden"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* active indicator */}
                            {active && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-500 rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div className="border-t border-border px-2 py-3 shrink-0">
                <div
                    className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
                        collapsed ? "justify-center" : ""
                    )}
                >
                    <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-semibold text-violet-500">
                            {user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </span>
                    </div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex-1 min-w-0 overflow-hidden"
                            >
                                <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={handleLogout}
                    className={cn(
                        "mt-1 flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full",
                        collapsed ? "justify-center" : ""
                    )}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="whitespace-nowrap overflow-hidden"
                            >
                                Sign out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={toggle}
                className="absolute -right-3 top-14 translate-y-4 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border-secondary transition-colors z-10"
            >
                {collapsed
                    ? <ChevronRight className="w-3 h-3" />
                    : <ChevronLeft className="w-3 h-3" />}
            </button>
        </motion.aside>
    );
}