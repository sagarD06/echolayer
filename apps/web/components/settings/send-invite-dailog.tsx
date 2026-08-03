"use client";

import { useState } from "react";
import { useSendInvitesMutation } from "@/services/invite.api";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SendInviteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
}

export function SendInviteDialog({ open, onOpenChange, projectId }: SendInviteDialogProps) {
    const [sendInvites, { isLoading }] = useSendInvitesMutation();
    const [emails, setEmails] = useState<string[]>([""]);
    const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
    const [errors, setErrors] = useState<string[]>([]);

    function handleEmailChange(index: number, value: string) {
        const updated = [...emails];
        updated[index] = value;
        setEmails(updated);
        const updatedErrors = [...errors];
        updatedErrors[index] = "";
        setErrors(updatedErrors);
    }

    function addEmail() {
        if (emails.length >= 5) return;
        setEmails((prev) => [...prev, ""]);
    }

    function removeEmail(index: number) {
        setEmails((prev) => prev.filter((_, i) => i !== index));
        setErrors((prev) => prev.filter((_, i) => i !== index));
    }

    function validate() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newErrors = emails.map((e) =>
            !e.trim() ? "Email is required." : !emailRegex.test(e.trim()) ? "Invalid email." : ""
        );
        setErrors(newErrors);
        return newErrors.every((e) => !e);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        try {
            await sendInvites({
                projectId,
                emails: emails.map((e) => e.trim()),
                role,
            }).unwrap();
            toast.success("Invites sent! They may take a moment to arrive.");
            handleClose();
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to send invites.");
        }
    }

    function handleClose() {
        if (!isLoading) {
            setEmails([""]);
            setRole("MEMBER");
            setErrors([]);
            onOpenChange(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite to project</DialogTitle>
                    <DialogDescription>
                        Send email invites to collaborators. Invites expire after 7 days.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
                    {/* role */}
                    <div className="flex flex-col gap-1.5">
                        <Label>Role</Label>
                        <Select value={role} onValueChange={(v) => setRole(v as "ADMIN" | "MEMBER")}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MEMBER">Member — view and comment</SelectItem>
                                <SelectItem value="ADMIN">Admin — full project access</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* email inputs */}
                    <div className="flex flex-col gap-2">
                        <Label>Email addresses</Label>
                        {emails.map((email, i) => (
                            <div key={i} className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        type="email"
                                        placeholder={`colleague${i + 1}@company.com`}
                                        value={email}
                                        onChange={(e) => handleEmailChange(i, e.target.value)}
                                        disabled={isLoading}
                                    />
                                    {errors[i] && (
                                        <p className="text-xs text-destructive mt-1">{errors[i]}</p>
                                    )}
                                </div>
                                {emails.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive shrink-0"
                                        onClick={() => removeEmail(i)}
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}

                        {emails.length < 5 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="w-fit h-8 text-xs gap-1.5 text-muted-foreground"
                                onClick={addEmail}
                                disabled={isLoading}
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add another email
                            </Button>
                        )}
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
                            className="bg-violet-500 hover:bg-violet-600 text-white"
                            disabled={isLoading}
                        >
                            {isLoading
                                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending…</>
                                : `Send invite${emails.length > 1 ? "s" : ""}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}