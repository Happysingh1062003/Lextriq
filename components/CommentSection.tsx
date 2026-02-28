"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Send, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { timeAgo } from "@/lib/utils";
import type { CommentWithUser } from "@/types";
import Link from "next/link";

interface CommentSectionProps {
    promptId: string;
    comments: CommentWithUser[];
    onCommentAdded?: (comment: CommentWithUser) => void;
    onCommentDeleted?: (commentId: string) => void;
}

export function CommentSection({
    promptId,
    comments: initialComments,
    onCommentAdded,
    onCommentDeleted,
}: CommentSectionProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState(initialComments);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/prompts/${promptId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: content.trim() }),
            });

            if (!res.ok) throw new Error("Failed to post comment");

            const newComment = await res.json();
            setComments((prev) => [newComment, ...prev]);
            setContent("");
            onCommentAdded?.(newComment);
            toast.success("Comment posted!");
        } catch {
            toast.error("Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete comment");

            setComments((prev) => prev.filter((c) => c.id !== commentId));
            onCommentDeleted?.(commentId);
            toast.success("Comment deleted");
        } catch {
            toast.error("Failed to delete comment");
        }
    };



    return (
        <div>
            <h3 className="text-lg font-semibold text-pv-text font-[family-name:var(--font-bricolage)] mb-4">
                Discussion ({comments.length})
            </h3>

            {/* Comment input */}
            {session?.user ? (
                <div className="flex gap-3 mb-6">
                    <UserAvatar
                        name={session.user.name}
                        image={session.user.image}
                        className="w-8 h-8 mt-1"
                    />
                    <div className="flex-1">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write a comment..."
                            className="bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 resize-none min-h-[80px]"
                        />
                        <div className="flex justify-end mt-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={!content.trim() || isSubmitting}
                                size="sm"
                                className="bg-pv-primary hover:bg-pv-primary-2 text-white glow-button"
                            >
                                <Send className="w-3 h-3 mr-1.5" />
                                {isSubmitting ? "Posting..." : "Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass-card rounded-lg p-4 mb-6 text-center">
                    <p className="text-sm text-pv-muted">
                        <Link href="/login" className="text-pv-primary hover:underline">
                            Sign in
                        </Link>{" "}
                        to join the discussion
                    </p>
                </div>
            )}

            {/* Comments list */}
            <div className="space-y-4">
                <AnimatePresence>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex gap-3"
                        >
                            <UserAvatar
                                name={comment.user.name}
                                image={comment.user.image}
                                className="w-8 h-8 mt-0.5"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-pv-text">
                                        {comment.user.name || "Anonymous"}
                                    </span>
                                    <span className="text-xs text-pv-muted">
                                        {timeAgo(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-pv-text/80 mt-1">
                                    {comment.content}
                                </p>
                                {session?.user &&
                                    session.user.id === comment.userId && (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="flex items-center gap-1 text-xs text-pv-muted hover:text-red-400 mt-1 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Delete
                                        </button>
                                    )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
