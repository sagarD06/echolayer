"use client";

import { useState, useMemo } from "react";
import {
    useGetProjectMembersQuery,
    useAddProjectMemberMutation,
} from "@/services/project.api";
import { useGetOrganisationMembersQuery } from "@/services/organisation.api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
}

export function AddMemberDialog({
    open,
    onOpenChange,
    projectId,
}: AddMemberDialogProps) {
    const [addMember, { isLoading }] = useAddProjectMemberMutation();
    const { data: orgMembers = [] } = useGetOrganisationMembersQuery();
    const { data: projectMembers = [] } = useGetProjectMembersQuery(projectId);

    const [selectedUserId, setSelectedUserId] = useState("");
    const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    // filter out members already in project and OWNER (auto-access)
    const availableMembers = useMemo(() => {
        const projectMemberIds = new Set(projectMembers.map((m) => m.Id));
        return orgMembers.filter(
            (m) =>
                m.role !== "OWNER" &&
                !projectMemberIds.has(m.id) &&
                (search === "" ||
                    m.name.toLowerCase().includes(search.toLowerCase()) ||
                    m.email.toLowerCase().includes(search.toLowerCase()))
        );
    }, [orgMembers, projectMembers, search]);

    const selectedMember = orgMembers.find((m) => m.id === selectedUserId);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedUserId || !selectedMember) {
            setError("Please select a member.");
            return;
        }
        try {
            await addMember({ email: selectedMember.email, role, projectId }).unwrap();
            toast.success(
                `${selectedMember.name ?? "Member"} added to project.`
            );
            handleClose();
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to add member.");
        }
    }

    function handleClose() {
        if (!isLoading) {
            setSelectedUserId("");
            setRole("MEMBER");
            setSearch("");
            setError("");
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add member to project</DialogTitle>
                    <DialogDescription>
                        Add an existing organisation member to this project.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
                    {/* search */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Organisation member</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                                disabled={isLoading}
                            />
                        </div>

                        {/* member list */}
                        <div className="border border-border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                            {availableMembers.length === 0 ? (
                                <div className="px-4 py-6 text-center">
                                    <p className="text-xs text-muted-foreground">
                                        {search
                                            ? "No members match your search."
                                            : "All org members are already in this project."}
                                    </p>
                                </div>
                            ) : (
                                availableMembers.map((member) => (
                                    <button
                                        key={member.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedUserId(member.id);
                                            setError("");
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border last:border-0 transition-colors",
                                            selectedUserId === member.id
                                                ? "bg-violet-50 dark:bg-violet-950/30"
                                                : "hover:bg-muted/40"
                                        )}
                                    >
                                        <div className="w-7 h-7 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                                            <span className="text-[11px] font-semibold text-violet-500">
                                                {member.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {member.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {member.email}
                                            </p>
                                        </div>
                                        {selectedUserId === member.id && (
                                            <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                                                <span className="text-white text-[10px]">✓</span>
                                            </div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                        {error && <p className="text-xs text-destructive">{error}</p>}
                    </div>

                    {/* role */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Project role</Label>
                        <Select
                            value={role}
                            onValueChange={(v) => setRole(v as "ADMIN" | "MEMBER")}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MEMBER">
                                    Member — view and comment
                                </SelectItem>
                                <SelectItem value="ADMIN">
                                    Admin — full project access
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-violet-500 hover:bg-violet-600 text-white gap-2"
                            disabled={isLoading || !selectedUserId}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Adding…
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Add member
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}