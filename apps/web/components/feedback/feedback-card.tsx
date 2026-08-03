"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUpdateFeedbackStatusMutation, useDeleteFeedbackMutation } from "@/services/feedback.api";
import type { Feedback, FeedbackType, FeedbackStatus } from "@/types/dashboardType";
import { formatDistanceToNow } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";

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

const STATUS_OPTIONS: { value: FeedbackStatus; label: string }[] = [
    { value: "OPEN", label: "Open" },
    { value: "PLANNED", label: "Planned" },
    { value: "IN_PROGRESS", label: "In progress" },
    { value: "COMPLETED", label: "Completed" },
];

const STATUS_LABEL: Record<FeedbackStatus, string> = {
    OPEN: "Open",
    PLANNED: "Planned",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
};

interface FeedbackCardProps {
    feedback: Feedback;
    index: number;
}

export function FeedbackCard({ feedback, index }: FeedbackCardProps) {
    const [updateStatus, { isLoading: isUpdating }] = useUpdateFeedbackStatusMutation();
    const [deleteFeedback, { isLoading: isDeleting }] = useDeleteFeedbackMutation();

    async function handleStatusChange(status: FeedbackStatus) {
        if (status === feedback.status) return;
        try {
            await updateStatus({
                feedbackId: feedback.id,
                status,
            }).unwrap();
            toast.success("Status updated.");
        } catch {
            toast.error("Failed to update status.");
        }
    }

    async function handleDelete() {
        try {
            await deleteFeedback({
                feedbackId: feedback.id
            }).unwrap();
            toast.success("Feedback deleted.");
        } catch {
            toast.error("Failed to delete feedback.");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:border-border-secondary transition-colors"
        >
            {/* top row */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", TYPE_STYLES[feedback.type])}>
                        {feedback.type.charAt(0) + feedback.type.slice(1).toLowerCase()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
                    </span>
                </div>

                {/* delete menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* content */}
            <div>
                <p className="text-sm font-medium text-foreground">{feedback.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{feedback.content}</p>
            </div>

            {/* status selector */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            disabled={isUpdating}
                            className={cn(
                                "flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full transition-opacity",
                                STATUS_STYLES[feedback.status],
                                isUpdating && "opacity-50"
                            )}
                        >
                            {STATUS_LABEL[feedback.status]}
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-36">
                        <DropdownMenuLabel className="text-xs">Change status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {STATUS_OPTIONS.map((opt) => (
                            <DropdownMenuItem
                                key={opt.value}
                                onClick={() => handleStatusChange(opt.value)}
                                className={cn(
                                    "text-xs",
                                    feedback.status === opt.value && "font-medium"
                                )}
                            >
                                {opt.label}
                                {feedback.status === opt.value && (
                                    <span className="ml-auto text-violet-500">✓</span>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.div>
    );
}