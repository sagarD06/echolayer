import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
    loading?: boolean;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    iconColor = "text-violet-500",
    iconBg = "bg-violet-500/10",
    trend,
    loading,
}: StatCardProps) {
    if (loading) {
        return (
            <div className="rounded-xl border border-border bg-card p-5">
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconBg)}>
                    <Icon className={cn("w-4 h-4", iconColor)} />
                </div>
            </div>
            <div>
                <p className="text-2xl font-semibold text-foreground tracking-tight">{value}</p>
                {trend && (
                    <p
                        className={cn(
                            "text-xs mt-0.5",
                            trend.positive ? "text-green-500" : "text-red-500"
                        )}
                    >
                        {trend.positive ? "↑" : "↓"} {trend.value}
                    </p>
                )}
            </div>
        </div>
    );
}