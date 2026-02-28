"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UpvoteButtonProps {
    promptId: string;
    initialCount: number;
    initialUpvoted: boolean;
    onToggle?: (upvoted: boolean, count: number) => void;
}

export function UpvoteButton({
    promptId,
    initialCount,
    initialUpvoted,
    onToggle,
}: UpvoteButtonProps) {
    const [upvoted, setUpvoted] = useState(initialUpvoted);
    const [count, setCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);
    const [justToggled, setJustToggled] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoading) return;

        const newUpvoted = !upvoted;
        const newCount = newUpvoted ? count + 1 : count - 1;

        setUpvoted(newUpvoted);
        setCount(newCount);
        onToggle?.(newUpvoted, newCount);

        // Micro-reward animation
        if (newUpvoted) {
            setJustToggled(true);
            setTimeout(() => setJustToggled(false), 400);
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/prompts/${promptId}/upvote`, {
                method: "POST",
            });
            if (!res.ok) {
                setUpvoted(!newUpvoted);
                setCount(count);
                toast.error("Failed to update upvote. Please sign in.");
            }
        } catch {
            setUpvoted(!newUpvoted);
            setCount(count);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "flex items-center gap-1.5 font-semibold transition-colors duration-200 active:scale-95",
                upvoted
                    ? "text-rose-600"
                    : "text-zinc-500 hover:text-zinc-900"
            )}
            disabled={isLoading}
        >
            <Heart className={cn("w-4 h-4 transition-transform", upvoted && "fill-rose-500 text-rose-500 scale-110", justToggled && "animate-bounce-micro")} />
            {count > 0 && <span className="text-[13px]">{count}</span>}
        </button>
    );
}
