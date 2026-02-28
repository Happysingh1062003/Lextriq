"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookmarkButtonProps {
    promptId: string;
    initialBookmarked: boolean;
    onToggle?: (bookmarked: boolean) => void;
}

export function BookmarkButton({
    promptId,
    initialBookmarked,
    onToggle,
}: BookmarkButtonProps) {
    const [bookmarked, setBookmarked] = useState(initialBookmarked);
    const [isLoading, setIsLoading] = useState(false);
    const [justToggled, setJustToggled] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLoading) return;

        const newBookmarked = !bookmarked;
        setBookmarked(newBookmarked);
        onToggle?.(newBookmarked);

        // Micro-reward animation
        if (newBookmarked) {
            setJustToggled(true);
            setTimeout(() => setJustToggled(false), 400);
        }

        setIsLoading(true);
        try {
            const res = await fetch(`/api/prompts/${promptId}/bookmark`, {
                method: "POST",
            });
            if (!res.ok) {
                setBookmarked(!newBookmarked);
                toast.error("Failed to update bookmark. Please sign in.");
            } else {
                toast.success(newBookmarked ? "Prompt saved!" : "Bookmark removed");
            }
        } catch {
            setBookmarked(!newBookmarked);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "p-2 rounded-lg transition-all active:scale-95 duration-200",
                bookmarked
                    ? "text-pv-primary bg-pv-primary/5"
                    : "text-zinc-400 hover:text-pv-primary hover:bg-zinc-50"
            )}
            disabled={isLoading}
        >
            <Bookmark
                className={cn("w-4 h-4 transition-transform", bookmarked && "fill-pv-primary scale-110", justToggled && "animate-bounce-micro")}
            />
        </button>
    );
}
