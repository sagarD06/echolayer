"use client";

import type { FeedbackType, FeedbackStatus } from "@/types/dashboardType";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Download, X } from "lucide-react";

const TYPES: { value: FeedbackType; label: string }[] = [
    { value: "IDEA", label: "Idea" },
    { value: "SUGGESTION", label: "Suggestion" },
    { value: "PROBLEM", label: "Problem" },
    { value: "QUESTION", label: "Question" },
    { value: "PRAISE", label: "Praise" },
];

const STATUSES: { value: FeedbackStatus; label: string }[] = [
    { value: "OPEN", label: "Open" },
    { value: "PLANNED", label: "Planned" },
    { value: "IN_PROGRESS", label: "In progress" },
    { value: "COMPLETED", label: "Completed" },
];

interface FeedbackFiltersProps {
    type: FeedbackType | undefined;
    status: FeedbackStatus | undefined;
    onTypeChange: (val: FeedbackType | undefined) => void;
    onStatusChange: (val: FeedbackStatus | undefined) => void;
    onExport: () => void;
    isExporting: boolean;
    total: number;
}

export function FeedbackFilters({
    type,
    status,
    onTypeChange,
    onStatusChange,
    onExport,
    isExporting,
    total,
}: FeedbackFiltersProps) {
    const hasFilters = !!type || !!status;

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-muted-foreground shrink-0">
                {total} result{total !== 1 ? "s" : ""}
            </span>

            <div className="flex items-center gap-2 flex-1 flex-wrap">
                {/* type filter */}
                <Select
                    value={type ?? "all"}
                    onValueChange={(v) => onTypeChange(v === "all" ? undefined : (v as FeedbackType))}
                >
                    <SelectTrigger className="h-8 text-xs w-36">
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                                {t.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* status filter */}
                <Select
                    value={status ?? "all"}
                    onValueChange={(v) =>
                        onStatusChange(v === "all" ? undefined : (v as FeedbackStatus))
                    }
                >
                    <SelectTrigger className="h-8 text-xs w-36">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                                {s.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* clear filters */}
                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1.5 text-muted-foreground"
                        onClick={() => {
                            onTypeChange(undefined);
                            onStatusChange(undefined);
                        }}
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </Button>
                )}
            </div>

            {/* export */}
            <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 shrink-0"
                onClick={onExport}
                disabled={isExporting}
            >
                <Download className="w-3.5 h-3.5" />
                {isExporting ? "Exporting…" : "Export CSV"}
            </Button>
        </div>
    );
}