"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/Auth.store";
import { useGetOrganisationQuery } from "@/services/organisation.api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
    "/dashboard": "Overview",
    "/dashboard/projects": "Projects",
    "/dashboard/settings": "Settings",
};

function getPageTitle(pathname: string): string {
    if (ROUTE_LABELS[pathname]) return ROUTE_LABELS[pathname];
    if (pathname.includes("/projects/") && pathname.includes("/settings"))
        return "Project settings";
    if (pathname.includes("/projects/") && pathname.includes("/widget"))
        return "Widget & sharing";
    if (pathname.includes("/projects/")) return "Project";
    return "Dashboard";
}

const ROLE_STYLES = {
    OWNER: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    MEMBER: "bg-muted text-muted-foreground",
};

export function Header() {
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);
    const { data: org, isLoading } = useGetOrganisationQuery();
    console.log(user)

    return (
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card shrink-0">
            <h1 className="text-sm font-semibold text-foreground">
                {getPageTitle(pathname!)}
            </h1>

            <div className="flex items-center gap-3">
                {/* Org name */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    {isLoading
                        ? <Skeleton className="h-3.5 w-20" />
                        : <span>{org?.name}</span>}
                </div>

                <div className="w-px h-4 bg-border" />

                {/* Role badge */}
                {user?.role && (
                    <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ROLE_STYLES[user.role]}`}
                    >
                        {user.role}
                    </span>
                )}

                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="text-[11px] font-semibold text-violet-500">
                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </span>
                </div>
            </div>
        </header>
    );
}