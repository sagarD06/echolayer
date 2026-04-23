"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useGetProjectQuery } from "@/services/project.api";
import { useListFeedbacksQuery, useLazyExportFeedbacksQuery } from "@/services/feedback.api";
import { useGetProjectStatsQuery } from "@/services/stats.api";
import { FeedbackFilters } from "@/components/feedback/feedback-filters";
import { FeedbackCard } from "@/components/feedback/feedback-card";
// import { AIAnalyze } from "@/components/feedback/AIAnalyze";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FeedbackType, FeedbackStatus } from "@/types/dashboardType";
import {
    MessageSquare,
    CheckCircle2,
    CircleDot,
} from "lucide-react";
import { toast } from "sonner";

export default function ProjectDetailPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId;

    const [typeFilter, setTypeFilter] = useState<FeedbackType | undefined>();
    const [statusFilter, setStatusFilter] = useState<FeedbackStatus | undefined>();

    const { data: project, isLoading: projectLoading } = useGetProjectQuery(projectId!);
    const { data: stats, isLoading: statsLoading } = useGetProjectStatsQuery(projectId!);
    const { data: feedbackData, isLoading: feedbackLoading } = useListFeedbacksQuery({
        projectId: projectId!
    });

    const [exportFeedbacks, { isFetching: isExporting }] = useLazyExportFeedbacksQuery();

    async function handleExport() {
        try {
            const blob = await exportFeedbacks(projectId!).unwrap();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${project?.name ?? "feedbacks"}-export.csv`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Export downloaded.");
        } catch {
            toast.error("Export failed. Please try again.");
        }
    }

    const feedbacks = feedbackData?.items ?? [];
    const total = feedbackData?.items.length ?? 0;

    return (
        <div className="flex flex-col gap-6 max-w-5xl">
            {/* project name */}
            <div>
                {projectLoading
                    ? <Skeleton className="h-7 w-40" />
                    : <h2 className="text-xl font-semibold text-foreground">{project?.name}</h2>}
                <p className="text-sm text-muted-foreground mt-0.5">
                    Feedback overview and management
                </p>
            </div>

            {/* stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    label="Total feedbacks"
                    value={stats?.totalFeedbacks ?? 0}
                    icon={MessageSquare}
                    iconBg="bg-violet-500/10"
                    iconColor="text-violet-500"
                    loading={statsLoading}
                />
                <StatCard
                    label="Open"
                    value={stats?.feedbackByStatus?.OPEN ?? 0}
                    icon={CircleDot}
                    iconBg="bg-amber-500/10"
                    iconColor="text-amber-500"
                    loading={statsLoading}
                />
                <StatCard
                    label="Resolved"
                    value={stats?.feedbackByStatus?.COMPLETED ?? 0}
                    icon={CheckCircle2}
                    iconBg="bg-green-500/10"
                    iconColor="text-green-500"
                    loading={statsLoading}
                />
            </div>

            {/* AI analyze */}
            {/* <AIAnalyze
                projectId={projectId}
                feedbackCount={stats?.totalFeedbacks ?? 0}
            /> */}

            {/* filter bar */}
            <div className="rounded-xl border border-border bg-card p-4">
                <FeedbackFilters
                    type={typeFilter}
                    status={statusFilter}
                    onTypeChange={setTypeFilter}
                    onStatusChange={setStatusFilter}
                    onExport={handleExport}
                    isExporting={isExporting}
                    total={total}
                />
            </div>

            {/* feedback list */}
            {feedbackLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))}
                </div>
            ) : feedbacks.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                        <MessageSquare className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No feedbacks found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {typeFilter || statusFilter
                            ? "Try clearing your filters."
                            : "Share your project link to start collecting feedback."}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {feedbacks.map((fb, i) => (
                        <FeedbackCard key={fb.id} feedback={fb} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}