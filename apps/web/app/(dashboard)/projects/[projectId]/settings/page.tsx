"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProjectQuery, useUpdateProjectMutation, useDeleteProjectMutation } from "@/services/project.api";
import { useAuthStore } from "@/store/Auth.store";
import { MembersTab } from "@/components/settings/members-tab";
import { InvitesTab } from "@/components/settings/invites-tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
import { cn } from "@/lib/utils";
import { Users, Mail, Settings, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Tab = "members" | "invites";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "members", label: "Members", icon: Users },
    { id: "invites", label: "Invites", icon: Mail },
];

export default function ProjectSettingsPage() {
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId ?? "";
    const router = useRouter();

    const currentUser = useAuthStore((s) => s.user);
    const isOwner = currentUser?.role === "OWNER";

    const { data: project, isLoading: projectLoading } = useGetProjectQuery(projectId);
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

    const [activeTab, setActiveTab] = useState<Tab>("members");
    const [projectName, setProjectName] = useState("");
    const [nameError, setNameError] = useState("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    // sync project name into local state once loaded
    useEffect(() => {
        if (project?.name) {
            setProjectName(project.name);
        }
    }, [project?.name]);

    async function handleUpdateName(e: React.FormEvent) {
        e.preventDefault();
        if (!projectName.trim()) {
            setNameError("Project name is required.");
            return;
        }
        if (projectName.trim() === project?.name) {
            setNameError("Name is the same as current.");
            return;
        }
        try {
            await updateProject({ projectId, name: projectName.trim() }).unwrap();
            toast.success("Project name updated.");
            setNameError("");
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to update project.");
        }
    }

    async function handleDelete() {
        try {
            await deleteProject(projectId).unwrap();
            toast.success("Project deleted.");
            router.push("/dashboard/projects");
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to delete project.");
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-3xl">
            {/* project name */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">General</h2>
                </div>

                <div className="rounded-xl border border-border bg-card p-5">
                    {projectLoading ? (
                        <Skeleton className="h-9 w-full rounded-lg" />
                    ) : (
                        <form onSubmit={handleUpdateName} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="project-name">Project name</Label>
                                <div className="flex gap-3">
                                    <Input
                                        id="project-name"
                                        value={projectName}
                                        onChange={(e) => {
                                            setProjectName(e.target.value);
                                            setNameError("");
                                        }}
                                        className="flex-1"
                                        disabled={isUpdating}
                                    />
                                    <Button
                                        type="submit"
                                        className="bg-violet-500 hover:bg-violet-600 text-white shrink-0"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating
                                            ? <Loader2 className="w-4 h-4 animate-spin" />
                                            : "Save"}
                                    </Button>
                                </div>
                                {nameError && (
                                    <p className="text-xs text-destructive">{nameError}</p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <Separator />

            {/* members + invites tabs */}
            <div className="flex flex-col gap-4">
                {/* tab bar */}
                <div className="flex border-b border-border">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                                activeTab === tab.id
                                    ? "border-violet-500 text-violet-500"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* tab content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                    >
                        {activeTab === "members" && <MembersTab projectId={projectId} />}
                        {activeTab === "invites" && <InvitesTab projectId={projectId} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* danger zone */}
            {isOwner && (
                <>
                    <Separator />
                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
                        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-foreground">Delete this project</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Permanently delete this project and all its feedbacks. This cannot be undone.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white shrink-0 gap-2"
                                onClick={() => setDeleteConfirmOpen(true)}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete project
                            </Button>
                        </div>
                    </div>
                </>
            )}

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &quot;{project?.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the project and all its feedbacks. There is no going back.
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
        </div>
    );
}