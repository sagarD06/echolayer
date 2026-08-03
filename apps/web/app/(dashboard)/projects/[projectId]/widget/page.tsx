"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useGetProjectQuery } from "@/services/project.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import QRCode from "react-qr-code";
import {
    Link2,
    Code2,
    QrCode,
    Copy,
    Check,
    Download,
} from "lucide-react";
import { toast } from "sonner";

export default function WidgetPage() {
    const params = useParams();
    const projectId =
        typeof params?.projectId === "string"
            ? params.projectId
            : Array.isArray(params?.projectId)
            ? params.projectId[0] ?? ""
            : "";
    const { data: project, isLoading } = useGetProjectQuery(projectId);

    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const feedbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/feedback/${projectId}`;

    const widgetSnippet = `<!-- EchoLayer Feedback Widget -->
<script>
  (function() {
    var s = document.createElement('script');
    s.src = '${process.env.NEXT_PUBLIC_APP_URL}/widget.js';
    s.dataset.projectId = '${projectId}';
    s.dataset.position = 'bottom-right';
    document.head.appendChild(s);
  })();
</script>`;

    const iframeSnippet = `<iframe
  src="${feedbackUrl}?embed=true"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid #e5e7eb;"
  title="Feedback form"
></iframe>`;

    async function copyToClipboard(text: string, key: string) {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            toast.success("Copied to clipboard.");
            setTimeout(() => setCopiedKey(null), 2000);
        } catch {
            toast.error("Failed to copy.");
        }
    }

    function downloadQR() {
        const svg = document.getElementById("qr-code-svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        canvas.width = 400;
        canvas.height = 400;

        img.onload = () => {
            ctx?.drawImage(img, 0, 0, 400, 400);
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = `${project?.name ?? "feedback"}-qr.png`;
            a.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
        toast.success("QR code downloaded.");
    }

    function CopyButton({ text, copyKey }: { text: string; copyKey: string }) {
        const copied = copiedKey === copyKey;
        return (
            <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs shrink-0"
                onClick={() => copyToClipboard(text, copyKey)}
            >
                {copied
                    ? <><Check className="w-3.5 h-3.5 text-green-500" />Copied</>
                    : <><Copy className="w-3.5 h-3.5" />Copy</>}
            </Button>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl">
            {/* header */}
            <div>
                {isLoading
                    ? <Skeleton className="h-7 w-40 mb-1" />
                    : <h2 className="text-xl font-semibold text-foreground">
                        Widget &amp; sharing
                    </h2>}
                <p className="text-sm text-muted-foreground mt-0.5">
                    Share your feedback form via link, embed it as a widget, or use a QR code.
                </p>
            </div>

            <Tabs defaultValue="link">
                <TabsList className="w-full">
                    <TabsTrigger value="link" className="flex-1 gap-2">
                        <Link2 className="w-3.5 h-3.5" />
                        Shareable link
                    </TabsTrigger>
                    <TabsTrigger value="widget" className="flex-1 gap-2">
                        <Code2 className="w-3.5 h-3.5" />
                        Embed widget
                    </TabsTrigger>
                    <TabsTrigger value="qr" className="flex-1 gap-2">
                        <QrCode className="w-3.5 h-3.5" />
                        QR code
                    </TabsTrigger>
                </TabsList>

                {/* ── Link tab ── */}
                <TabsContent value="link" className="mt-4">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4"
                    >
                        <div>
                            <p className="text-sm font-medium text-foreground mb-1">
                                Feedback form URL
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Share this link anywhere — email, Slack, social, or embed in your app.
                                No login required for submitters.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={feedbackUrl}
                                className="flex-1 text-xs font-mono bg-muted/40"
                            />
                            <CopyButton text={feedbackUrl} copyKey="link" />
                        </div>

                        {/* preview card */}
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Preview</p>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-6 h-6 rounded bg-violet-500 flex items-center justify-center shrink-0">
                                    <span className="text-white text-[10px] font-semibold">E</span>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">
                                        {isLoading ? "Loading…" : project?.name}
                                    </p>
                                    <p className="text-muted-foreground truncate max-w-xs">{feedbackUrl}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* ── Widget tab ── */}
                <TabsContent value="widget" className="mt-4">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4"
                    >
                        {/* Script embed */}
                        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">Script embed</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Add this snippet before your closing{" "}
                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">&lt;/body&gt;</code>{" "}
                                    tag. A floating button will appear for users to submit feedback.
                                </p>
                            </div>

                            <div className="relative">
                                <pre className="text-xs font-mono bg-muted/60 rounded-lg p-4 overflow-x-auto leading-relaxed text-foreground whitespace-pre-wrap">
                                    {widgetSnippet}
                                </pre>
                                <div className="absolute top-3 right-3">
                                    <CopyButton text={widgetSnippet} copyKey="widget-script" />
                                </div>
                            </div>
                        </div>

                        {/* iFrame embed */}
                        <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
                            <div>
                                <p className="text-sm font-medium text-foreground">iFrame embed</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Embed the feedback form inline inside your page or portal.
                                </p>
                            </div>

                            <div className="relative">
                                <pre className="text-xs font-mono bg-muted/60 rounded-lg p-4 overflow-x-auto leading-relaxed text-foreground whitespace-pre-wrap">
                                    {iframeSnippet}
                                </pre>
                                <div className="absolute top-3 right-3">
                                    <CopyButton text={iframeSnippet} copyKey="widget-iframe" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </TabsContent>

                {/* ── QR tab ── */}
                <TabsContent value="qr" className="mt-4">
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-border bg-card p-5 flex flex-col gap-6"
                    >
                        <div>
                            <p className="text-sm font-medium text-foreground">QR code</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Print or display this QR code at events, in stores, or anywhere
                                your customers are. Scanning opens the feedback form directly.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-5">
                            <div className="p-5 rounded-xl border border-border bg-white">
                                <QRCode value={feedbackUrl} size={200} fgColor="#0d1117" bgColor="#ffffff" />
                            </div>

                            <div className="flex gap-3">
                                <CopyButton text={feedbackUrl} copyKey="qr-link" />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 text-xs"
                                    onClick={downloadQR}
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download PNG
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground text-center max-w-xs">
                                The QR code points to your live feedback form. It updates automatically
                                if the URL changes.
                            </p>
                        </div>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}