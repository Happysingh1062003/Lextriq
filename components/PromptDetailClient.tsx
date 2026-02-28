"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Copy,
    Check,
    Share2,
    Eye,
    Calendar,
    ArrowLeft,
    Trash2,
    Terminal,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/CategoryBadge";
import { AiToolBadge } from "@/components/AiToolBadge";
import { UserAvatar } from "@/components/UserAvatar";
import { UpvoteButton } from "@/components/UpvoteButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CommentSection } from "@/components/CommentSection";
import { GlassCard } from "@/components/GlassCard";
import { ConfirmModal } from "@/components/ConfirmModal";
import { toast } from "sonner";
import { timeAgo } from "@/lib/utils";
import { copyToClipboard } from "@/lib/clipboard";
import Link from "next/link";

interface PromptDetailClientProps {
    prompt: any; // Ideally we pass down the precise type `PromptWithRelations`
}

export function PromptDetailClient({ prompt }: PromptDetailClientProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [showFullPrompt, setShowFullPrompt] = useState(false);
    const [copied, setCopied] = useState(false);
    const [localCopyCount, setLocalCopyCount] = useState(prompt?.copyCount || 0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const copyPrompt = async () => {
        if (prompt?.content) {
            const ok = await copyToClipboard(prompt.content);
            if (ok) {
                setCopied(true);
                setLocalCopyCount((prev: number) => prev + 1);
                toast.success("Prompt copied to clipboard!");
                fetch(`/api/prompts/${prompt.id}/copy`, { method: "POST" }).catch(() => { });
                setTimeout(() => setCopied(false), 2000);
            } else {
                toast.error("Failed to copy — try long-pressing to select.");
            }
        }
    };

    const sharePrompt = async () => {
        const ok = await copyToClipboard(window.location.href);
        if (ok) {
            toast.success("Link copied to clipboard!");
        } else {
            toast.error("Failed to copy link.");
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/prompts/${prompt.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Prompt deleted");
            router.push("/dashboard/my-prompts");
        } catch {
            toast.error("Failed to delete prompt");
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const userId = session?.user?.id;
    const isOwner = userId && prompt?.authorId === userId;

    if (!prompt) return null;

    const isLoggedIn = !!session;
    const isUpvoted = prompt.upvotes?.some((u: any) => u.userId === userId);
    const isBookmarked = prompt.bookmarks?.some((b: any) => b.userId === userId);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-pv-muted mb-6">
                <button onClick={() => router.back()} className="hover:text-pv-text transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <Link href="/dashboard/discover" className="hover:text-pv-text transition-colors">
                    Discover
                </Link>
                <span>→</span>
                <span>{prompt.category}</span>
                <span>→</span>
                <span className="text-pv-text truncate">{prompt.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-pv-text font-[family-name:var(--font-bricolage)]">
                        {prompt.title}
                    </h1>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                        <CategoryBadge category={prompt.category} />
                        {prompt.aiTool?.map((tool: string) => (
                            <AiToolBadge key={tool} tool={tool} />
                        ))}
                        {prompt.tags?.map((tag: string) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs border-zinc-200 text-zinc-500"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Author row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserAvatar
                                name={prompt.author.name}
                                image={prompt.author.image}
                                className="w-10 h-10"
                            />
                            <div>
                                <p className="text-sm font-medium text-pv-text">
                                    {prompt.author.name || "Anonymous"}
                                </p>
                                <p className="text-xs text-pv-muted">
                                    Posted {timeAgo(prompt.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <UpvoteButton
                                promptId={prompt.id}
                                initialCount={prompt._count?.upvotes || 0}
                                initialUpvoted={isUpvoted}
                            />
                            <BookmarkButton
                                promptId={prompt.id}
                                initialBookmarked={isBookmarked}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={sharePrompt}
                                className="text-pv-muted hover:text-pv-text"
                            >
                                <Share2 className="w-4 h-4" />
                            </Button>
                            {isOwner && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowDeleteModal(true)}
                                    className="text-pv-muted hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Prompt Text Box — unique code-block style */}
                    <div className="rounded-xl border border-zinc-200 overflow-hidden bg-zinc-950 shadow-sm">
                        {/* Terminal-style header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                                <span className="text-[11px] text-zinc-500 font-mono tracking-wide uppercase">
                                    Prompt · {prompt.content?.length || 0} chars
                                </span>
                            </div>
                            {isLoggedIn ? (
                                <button
                                    onClick={copyPrompt}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${copied
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white"
                                        }`}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            Copy Prompt
                                        </>
                                    )}
                                </button>
                            ) : (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/50 text-zinc-500 border border-zinc-700/50 cursor-not-allowed">
                                    <Lock className="w-3 h-3" />
                                    Sign in to Copy
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            {isLoggedIn ? (
                                <>
                                    <pre
                                        className={`text-[14px] text-zinc-200 whitespace-pre-wrap font-mono leading-[1.7] tracking-wide p-6 pt-5 selection:bg-violet-500/30 ${!showFullPrompt && prompt.content?.length > 500
                                            ? "max-h-[340px] overflow-hidden"
                                            : ""
                                            }`}
                                    >
                                        {prompt.content}
                                    </pre>
                                    {!showFullPrompt && prompt.content?.length > 500 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent flex items-end justify-center pb-5">
                                            <button
                                                onClick={() => setShowFullPrompt(true)}
                                                className="px-5 py-2 rounded-xl bg-zinc-800/80 backdrop-blur-md border border-zinc-700/50 text-zinc-200 text-[13px] font-medium hover:bg-zinc-700 hover:text-white transition-all shadow-xl shadow-black/20"
                                            >
                                                Show Full Prompt
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                /* Logged-out friction: blurred content with signup CTA */
                                <div className="relative">
                                    <pre
                                        className="text-[14px] text-zinc-200 whitespace-pre-wrap font-mono leading-[1.7] tracking-wide p-6 pt-5 max-h-[280px] overflow-hidden select-none"
                                        style={{ filter: 'blur(6px)', userSelect: 'none' }}
                                        aria-hidden="true"
                                    >
                                        {prompt.content}
                                    </pre>
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40 flex flex-col items-center justify-center gap-4 px-8">
                                        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-zinc-400" />
                                        </div>
                                        <h3 className="text-white text-lg font-semibold text-center">Unlock this prompt</h3>
                                        <p className="text-zinc-400 text-sm text-center max-w-xs">Sign up for free to view, copy, and save 10,000+ proven AI workflows.</p>
                                        <Link
                                            href="/auth/signin"
                                            className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
                                        >
                                            Sign Up Free
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results */}
                    {prompt.results && prompt.results.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-pv-text mb-4 font-[family-name:var(--font-bricolage)]">
                                Results & Examples
                            </h3>
                            <div className="space-y-4">
                                {prompt.results.map((result: any) => (
                                    <GlassCard key={result.id} hover={false}>
                                        {result.type === "image" && result.url ? (
                                            <div className="rounded-lg w-full">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={result.url}
                                                    alt="Result"
                                                    className="rounded-lg w-full"
                                                />
                                            </div>
                                        ) : (
                                            <pre className="text-sm text-pv-text/90 whitespace-pre-wrap font-mono">
                                                {result.content}
                                            </pre>
                                        )}
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comments */}
                    <GlassCard hover={false}>
                        <CommentSection
                            promptId={prompt.id}
                            comments={prompt.comments || []}
                        />
                    </GlassCard>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* About this Prompt */}
                    <GlassCard hover={false}>
                        <h4 className="text-sm font-semibold text-pv-text mb-4 font-[family-name:var(--font-bricolage)]">
                            About this Prompt
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-pv-muted flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5" /> Views
                                </span>
                                <span className="text-pv-text">{prompt.views}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-pv-muted flex items-center gap-1.5">
                                    <Copy className="w-3.5 h-3.5" /> Copies
                                </span>
                                <span className="text-pv-text">{localCopyCount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-pv-muted">Upvotes</span>
                                <span className="text-pv-text">{prompt._count?.upvotes || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-pv-muted">Bookmarks</span>
                                <span className="text-pv-text">{prompt._count?.bookmarks || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-pv-muted flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> Published
                                </span>
                                <span className="text-pv-text">
                                    {new Date(prompt.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Author Card */}
                    <GlassCard hover={false}>
                        <div className="flex items-center gap-3 mb-3">
                            <UserAvatar
                                name={prompt.author.name}
                                image={prompt.author.image}
                                className="w-12 h-12"
                            />
                            <div>
                                <p className="font-medium text-pv-text">
                                    {prompt.author.name || "Anonymous"}
                                </p>
                                {prompt.author.bio && (
                                    <p className="text-xs text-pv-muted">{prompt.author.bio}</p>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Prompt"
                description="This action is irreversible. Your prompt and all its comments will be permanently deleted."
                confirmLabel="Delete"
                variant="destructive"
                isLoading={isDeleting}
            />
        </div>
    );
}
