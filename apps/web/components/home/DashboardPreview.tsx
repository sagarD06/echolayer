import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { FEEDBACK_ITEMS } from "@/mock/mockdata_homepage";

import FeedbackRow from "./FeedbackRow";

const DashboardPreview = () => {
    return (
        <div className="w-full max-w-3xl mx-auto mt-16 rounded-xl border border-border/60 bg-card overflow-hidden shadow-2xl shadow-violet-500/10">
            {/* window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/40">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-[11px] text-muted-foreground">
                    dashboard — acme corp / mobile app
                </span>
            </div>

            <div className="p-5 flex flex-col gap-4">
                {/* stat row */}
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { val: "284", label: "Total feedbacks", color: "text-foreground" },
                        { val: "68%", label: "Resolved", color: "text-green-500" },
                        { val: "12", label: "This week", color: "text-violet-500" },
                        { val: "5", label: "In progress", color: "text-amber-500" },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="rounded-lg border border-border/50 bg-background p-3"
                        >
                            <p className={cn("text-xl font-medium", s.color)}>{s.val}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* feedback rows */}
                <div className="flex flex-col gap-2">
                    {FEEDBACK_ITEMS.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <FeedbackRow item={item} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardPreview;