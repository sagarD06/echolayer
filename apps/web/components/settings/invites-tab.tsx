"use client";

import { useState } from "react";
import {
    useGetInvitesQuery,
    useResendInviteMutation,
    useCancelInviteMutation,
} from "@/services/invite.api";
import { SendInviteDialog } from "./send-invite-dailog";
import { useAuthStore } from "@/store/Auth.store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Mail, Plus, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

const ROLE_STYLES = {
    ADMIN: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    MEMBER: "bg-muted text-muted-foreground",
};

interface InvitesTabProps {
    projectId: string;
}

export function InvitesTab({ projectId }: InvitesTabProps) {
    const currentUser = useAuthStore((s) => s.user);
    const { data: invites, isLoading } = useGetInvitesQuery(projectId);
    const [resendInvite, { isLoading: isResending }] = useResendInviteMutation();
    const [cancelInvite, { isLoading: isCancelling }] = useCancelInviteMutation();
    const [inviteOpen, setInviteOpen] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);

    const canManage =
        currentUser?.role === "OWNER" || currentUser?.role === "ADMIN";

    async function handleResend(inviteId: string) {
        setActionId(inviteId);
        try {
            await resendInvite({ projectId, inviteId }).unwrap();
            toast.success("Invite resent. It may take a moment to arrive.");
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to resend invite.");
        } finally {
            setActionId(null);
        }
    }

    async function handleCancel(inviteId: string) {
        setActionId(inviteId);
        try {
            await cancelInvite({ projectId, inviteId }).unwrap();
            toast.success("Invite cancelled.");
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to cancel invite.");
        } finally {
            setActionId(null);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-lg" />
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
                        {invites?.length ?? 0} pending invite{invites?.length !== 1 ? "s" : ""}
                    </p>
                    {canManage && (
                        <Button
                            size="sm"
                            className="bg-violet-500 hover:bg-violet-600 text-white gap-2 h-8 text-xs"
                            onClick={() => setInviteOpen(true)}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Invite people
                        </Button>
                    )}
                </div>

                {/* empty */}
                {(!invites || invites.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                            <Mail className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No pending invites</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {canManage
                                ? "Invite team members to collaborate on this project."
                                : "No invites have been sent yet."}
                        </p>
                    </div>
                )}

                {/* list */}
                {invites && invites.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                                        Email
                                    </th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                                        Role
                                    </th>
                                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
                                        Expires
                                    </th>
                                    {canManage && (
                                        <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {invites.map((invite) => {
                                    const isExpired = new Date(invite.expiresAt) < new Date();
                                    const isActioning = actionId === invite.id;

                                    return (
                                        <tr key={invite.id} className="hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <Mail className="w-3 h-3 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-xs text-foreground">{invite.email}</span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                                        ROLE_STYLES[invite.role]
                                                    )}
                                                >
                                                    {invite.role.charAt(0) + invite.role.slice(1).toLowerCase()}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        "text-xs",
                                                        isExpired ? "text-destructive" : "text-muted-foreground"
                                                    )}
                                                >
                                                    {isExpired
                                                        ? "Expired"
                                                        : formatDistanceToNow(new Date(invite.expiresAt), {
                                                            addSuffix: true,
                                                        })}
                                                </span>
                                            </td>

                                            {canManage && (
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 gap-1.5 text-xs text-muted-foreground"
                                                            onClick={() => handleResend(invite.id)}
                                                            disabled={isActioning || isResending}
                                                        >
                                                            <RefreshCw className="w-3 h-3" />
                                                            Resend
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleCancel(invite.id)}
                                                            disabled={isActioning || isCancelling}
                                                        >
                                                            <X className="w-3 h-3" />
                                                            Cancel
                                                        </Button>
                                                    </div>
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

            <SendInviteDialog
                open={inviteOpen}
                onOpenChange={setInviteOpen}
                projectId={projectId}
            />
        </>
    );
}