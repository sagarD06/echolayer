"use client";

import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { useGetOrgStatsQuery } from "@/services/stats.api";
import { useAuthStore } from "@/store/Auth.store";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  MessageSquare,
  CheckCircle2,
  FolderKanban,
  CircleDot,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading } = useGetOrgStatsQuery();

  const resolvedPercent =
    stats && stats.totalFeedbacks > 0 && stats.feedbackByStatus.COMPLETED
      ? Math.round((stats.feedbackByStatus.COMPLETED / stats.totalFeedbacks) * 100)
      : 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 max-w-6xl"
    >
      {/* greeting */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here&apos;s what&apos;s happening across your organisation.
        </p>
      </motion.div>

      {/* stat cards */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          label="Total feedbacks"
          value={stats?.totalFeedbacks ?? 0}
          icon={MessageSquare}
          iconBg="bg-violet-500/10"
          iconColor="text-violet-500"
          loading={isLoading}
        />
        <StatCard
          label="Open"
          value={stats?.feedbackByStatus?.OPEN ?? 0}
          icon={CircleDot}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-500"
          loading={isLoading}
        />
        <StatCard
          label="Resolved"
          value={stats?.feedbackByStatus?.COMPLETED ?? 0}
          icon={CheckCircle2}
          iconBg="bg-green-500/10"
          iconColor="text-green-500"
          trend={
            stats
              ? { value: `${resolvedPercent}% resolution rate`, positive: true }
              : undefined
          }
          loading={isLoading}
        />
        <StatCard
          label="Active projects"
          value={stats?.mostActiveProjects.length ?? 0}
          icon={FolderKanban}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-500"
          loading={isLoading}
        />
      </motion.div>
      {/* feedback trend chart */}
      <motion.div variants={item} className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Feedback trend</h2>
          <span className="text-xs text-muted-foreground ml-auto">Last 30 days</span>
        </div>

        {isLoading ? (
          <Skeleton className="h-52 w-full rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={stats?.feedbackTrend ?? []}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                tickFormatter={(val) => format(parseISO(val), "MMM d")}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--color-text-primary)",
                }}
                labelFormatter={(val) => format(parseISO(val as string), "MMM d, yyyy")}
                formatter={(val) => [val ?? 0, "Feedbacks"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#trendGradient)"
                dot={false}
                activeDot={{ r: 4, fill: "#8b5cf6" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* feedback type breakdown */}
      {!isLoading && stats?.feedbackByType && (
        <motion.div variants={item} className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Feedback breakdown</h2>
          <div className="flex flex-col gap-3">
            {(
              [
                { key: "PROBLEM", label: "Problem", color: "bg-red-500" },
                { key: "IDEA", label: "Idea", color: "bg-violet-500" },
                { key: "SUGGESTION", label: "Suggestion", color: "bg-blue-500" },
                { key: "PRAISE", label: "Praise", color: "bg-green-500" },
                { key: "QUESTION", label: "Question", color: "bg-amber-500" },
              ] as const
            ).map(({ key, label, color }) => {
              const count = stats.feedbackByType[key] ?? 0;
              const pct =
                stats.totalFeedbacks > 0
                  ? Math.round((count / stats.totalFeedbacks) * 100)
                  : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${color}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
      {/* most active projects */}
      {!isLoading && stats?.mostActiveProjects && stats.mostActiveProjects.length > 0 && (
        <motion.div variants={item} className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Most active projects</h2>
          <div className="flex flex-col divide-y divide-border">
            {stats.mostActiveProjects.map((project, i) => (
              <div key={project.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                  <div className="w-6 h-6 rounded bg-violet-500/10 flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-violet-500">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-foreground">{project.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {project.count} feedback{project.count !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}