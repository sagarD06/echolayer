import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { Feedback, FeedbackType, FeedbackStatus } from "@/types/dashboardType";
import { formatDistanceToNow } from "date-fns";

const TYPE_STYLES: Record<FeedbackType, string> = {
    IDEA: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    SUGGESTION: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    PROBLEM: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    QUESTION: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    PRAISE: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

const STATUS_STYLES: Record<FeedbackStatus, string> = {
    OPEN: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    PLANNED: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

const STATUS_LABEL: Record<FeedbackStatus, string> = {
    OPEN: "Open",
    PLANNED: "Planned",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
};

interface RecentFeedbacksProps {
    feedbacks: Feedback[];
    loading?: boolean;
}

export function RecentFeedbacks({ feedbacks, loading }: RecentFeedbacksProps) {
    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Recent feedbacks</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Latest submissions across all projects
                </p>
            </div>

            <div className="divide-y divide-border">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="px-5 py-4 flex items-start gap-3">
                            <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-full mb-1.5" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-5 w-20 rounded-full shrink-0" />
                        </div>
                    ))
                ) : feedbacks.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <p className="text-sm text-muted-foreground">No feedbacks yet.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Share your project link to start collecting feedback.
                        </p>
                    </div>
                ) : (
                    feedbacks.map((fb) => (
                        <div key={fb.id} className="px-5 py-4 flex items-start gap-3 group hover:bg-muted/30 transition-colors">
                            <span
                                className={cn(
                                    "text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5 shrink-0",
                                    TYPE_STYLES[fb.type]
                                )}
                            >
                                {fb.type.charAt(0) + fb.type.slice(1).toLowerCase()}
                            </span>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground font-medium truncate">{fb.title}</p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{fb.content}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(fb.createdAt), { addSuffix: true })}
                                </p>
                            </div>

                            <span
                                className={cn(
                                    "text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5 shrink-0",
                                    STATUS_STYLES[fb.status]
                                )}
                            >
                                {STATUS_LABEL[fb.status]}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}