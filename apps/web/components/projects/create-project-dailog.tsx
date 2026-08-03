"use client";

import { useState } from "react";
import { useCreateProjectMutation } from "@/services/project.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }
        try {
            await createProject({ name: name.trim() }).unwrap();
            toast.success(`Project "${name}" created.`);
            setName("");
            setError("");
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to create project.");
        }
    }

    function handleOpenChange(val: boolean) {
        if (!isLoading) {
            setName("");
            setError("");
            onOpenChange(val);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New project</DialogTitle>
                    <DialogDescription>
                        Create a project to start collecting feedback from your users.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="project-name">Project name</Label>
                        <Input
                            id="project-name"
                            placeholder="e.g. Mobile App, Checkout Flow"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError("");
                            }}
                            disabled={isLoading}
                            autoFocus
                        />
                        {error && <p className="text-xs text-destructive">{error}</p>}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-violet-500 hover:bg-violet-600 text-white"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating…</>
                                : "Create project"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}