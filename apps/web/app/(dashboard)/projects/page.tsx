"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGetProjectsQuery } from "@/services/project.api";
import { useAuthStore } from "@/store/Auth.store";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dailog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FolderKanban } from "lucide-react";

export default function ProjectsPage() {
    const user = useAuthStore((s) => s.user);
    const { data: projects, isLoading } = useGetProjectsQuery();
    const [createOpen, setCreateOpen] = useState(false);

    const isOwner = user?.role === "OWNER";
    const isEmpty = !isLoading && (!projects || projects.length === 0);

    return (
        <>
            <div className="flex flex-col gap-6 max-w-6xl">
                {/* page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">Projects</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {isLoading
                                ? "Loading…"
                                : `${projects?.length ?? 0} project${projects?.length === 1 ? "" : "s"}`}
                        </p>
                    </div>
                    {isOwner && (
                        <Button
                            onClick={() => setCreateOpen(true)}
                            className="bg-violet-500 hover:bg-violet-600 text-white gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New project
                        </Button>
                    )}
                </div>

                {/* loading */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-36 rounded-xl" />
                        ))}
                    </div>
                )}

                {/* empty state */}
                {isEmpty && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-14 h-14 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                            <FolderKanban className="w-7 h-7 text-violet-500" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">No projects yet</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                            {isOwner
                                ? "Create your first project to start collecting feedback."
                                : "You haven't been added to any projects yet."}
                        </p>
                        {isOwner && (
                            <Button
                                onClick={() => setCreateOpen(true)}
                                className="mt-5 bg-violet-500 hover:bg-violet-600 text-white gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create project
                            </Button>
                        )}
                    </motion.div>
                )}

                {/* grid */}
                {!isLoading && projects && projects.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project, i) => (
                            <ProjectCard key={project.id} project={project} index={i} />
                        ))}
                    </div>
                )}
            </div>

            <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
        </>
    );
}