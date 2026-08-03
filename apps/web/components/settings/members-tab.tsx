"use client";

import { useState } from "react";
import {
    useGetProjectMembersQuery,
    useUpdateProjectMemberRoleMutation,
    useRemoveProjectMemberMutation,
} from "@/services/project.api";
import { useAuthStore } from "@/store/Auth.store";
import { AddMemberDialog } from "./add-member-dailog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

const ROLE_STYLES = {
    ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    MEMBER: "bg-muted text-muted-foreground",
};

interface MembersTabProps {
    projectId: string;
}

export function MembersTab({ projectId }: MembersTabProps) {
    const currentUser = useAuthStore((s) => s.user);
    const { data: members, isLoading } = useGetProjectMembersQuery(projectId);
    console.log(members)
    const [updateRole] = useUpdateProjectMemberRoleMutation();
    const [removeMember, { isLoading: isRemoving }] = useRemoveProjectMemberMutation();

    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [removingUserId, setRemovingUserId] = useState<string | null>(null);
    const [confirmUser, setConfirmUser] = useState<{ id: string; name: string } | null>(null);

    const canManage =
        currentUser?.role === "OWNER" || currentUser?.role === "ADMIN";

    async function handleRoleChange(userId: string, role: "ADMIN" | "MEMBER") {
        try {
            await updateRole({ projectId, userId, role }).unwrap();
            toast.success("Role updated.");
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to update role.");
        }
    }

    async function handleRemove() {
        if (!confirmUser) return;
        setRemovingUserId(confirmUser.id);
        try {
            await removeMember({ projectId, userId: confirmUser.id }).unwrap();
            toast.success(`${confirmUser.name} removed from project.`);
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to remove member.");
        } finally {
            setRemovingUserId(null);
            setConfirmUser(null);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                {/* header */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {members?.length ?? 0} member{members?.length !== 1 ? "s" : ""}
                    </p>
                    {canManage && (
                        <Button
                            size="sm"
                            className="bg-violet-500 hover:bg-violet-600 text-white gap-2 h-8 text-xs"
                            onClick={() => setAddMemberOpen(true)}
                        >
                            <UserPlus className="w-3.5 h-3.5" />
                            Add member
                        </Button>
                    )}
                </div>

                {/* empty state */}
                {(!members || members.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                            <Users className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No members yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Add organisation members to collaborate on this project.
                        </p>
                        {canManage && (
                            <Button
                                size="sm"
                                className="mt-4 bg-violet-500 hover:bg-violet-600 text-white gap-2"
                                onClick={() => setAddMemberOpen(true)}
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                Add first member
                            </Button>
                        )}
                    </div>
                )}

                {/* table */}
                {members && members.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                                        Member
                                    </th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                                        Email
                                    </th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                                        Role
                                    </th>
                                    {canManage && (
                                        <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {members.map((member) => {
                                    const isSelf = member.Id === currentUser?.id;
                                    return (
                                        <tr
                                            key={member.email}
                                            className="hover:bg-muted/20 transition-colors"
                                        >
                                            {/* name */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                                                        <span className="text-[11px] font-semibold text-violet-500">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {member.name}
                                                        {isSelf && (
                                                            <span className="ml-1.5 text-[10px] text-muted-foreground font-normal">
                                                                (you)
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </td>

                                            {/* email */}
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-muted-foreground">
                                                    {member.email}
                                                </span>
                                            </td>

                                            {/* role */}
                                            <td className="px-4 py-3">
                                                {canManage && !isSelf ? (
                                                    <Select
                                                        value={member.role}
                                                        onValueChange={(v) =>
                                                            handleRoleChange(
                                                                member.Id,
                                                                v as "ADMIN" | "MEMBER"
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-7 w-28 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                                            <SelectItem value="MEMBER">Member</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <span
                                                        className={cn(
                                                            "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                                            ROLE_STYLES[member.role]
                                                        )}
                                                    >
                                                        {member.role.charAt(0) +
                                                            member.role.slice(1).toLowerCase()}
                                                    </span>
                                                )}
                                            </td>

                                            {/* remove */}
                                            {canManage && (
                                                <td className="px-4 py-3 text-right">
                                                    {!isSelf && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() =>
                                                                setConfirmUser({
                                                                    id: member.Id,
                                                                    name: member.name,
                                                                })
                                                            }
                                                            disabled={removingUserId === member.Id}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add member dialog */}
            <AddMemberDialog
                open={addMemberOpen}
                onOpenChange={setAddMemberOpen}
                projectId={projectId}
            />

            {/* Remove confirm dialog */}
            <AlertDialog
                open={!!confirmUser}
                onOpenChange={(o) => !o && setConfirmUser(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove {confirmUser?.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            They will lose access to this project immediately.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemove}
                            disabled={isRemoving}
                            className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                            {isRemoving ? "Removing…" : "Remove"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}