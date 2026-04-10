import { motion } from "framer-motion";
import { FeedbackItem } from "@/mock/mockdata_homepage";
import { cn } from "@/lib/utils";

const feedbackTypeStyles: Record<FeedbackItem["type"], string> = {
    Problem: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    Idea: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    Praise: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    Suggestion: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Question: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

const feedbackStatusStyles: Record<FeedbackItem["status"], string> = {
    Open: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300",
    Planned: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    "In progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    Completed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

const FeedbackRow = ({ item }: { item: FeedbackItem }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-background/60 backdrop-blur-sm"
        >
            <span
                className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5 shrink-0",
                    feedbackTypeStyles[item.type]
                )}
            >
                {item.type}
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 min-w-0">
                {item.text}
            </p>
            <span
                className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5 shrink-0",
                    feedbackStatusStyles[item.status]
                )}
            >
                {item.status}
            </span>
        </motion.div>
    );
}

export default FeedbackRow;