"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useDeleteProjectMutation } from "@/services/project.api";
import { useAuthStore } from "@/store/Auth.store";
import type { Project } from "@/types/dashboardType";
import { formatDistanceToNow } from "date-fns";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Settings, QrCode, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectCardProps {
    project: Project;
    index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    const user = useAuthStore((s) => s.user);
    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const isOwner = user?.role === "OWNER";

    async function handleDelete() {
        try {
            await deleteProject(project.id).unwrap();
            toast.success(`Project "${project.name}" deleted.`);
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to delete project.");
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="group rounded-xl border border-border bg-card p-5 flex flex-col gap-4 hover:border-violet-500/40 hover:shadow-sm transition-all"
            >
                {/* header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-violet-500">
                                {project.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">
                                {project.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/projects/${project.id}/settings`}>
                                    <Settings className="w-3.5 h-3.5 mr-2" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/projects/${project.id}/widget`}>
                                    <QrCode className="w-3.5 h-3.5 mr-2" />
                                    Widget & sharing
                                </Link>
                            </DropdownMenuItem>
                            {isOwner && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => setConfirmOpen(true)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                                        Delete project
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* footer */}
                <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground hover:text-violet-500 transition-colors group/link"
                >
                    <span>View feedbacks</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
            </motion.div>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &quot;{project.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the project and all its feedbacks. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                            {isDeleting ? "Deleting…" : "Delete project"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}