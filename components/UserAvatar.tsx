"use client";

import { memo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    name?: string | null;
    image?: string | null;
    className?: string;
}

function getAvatarUrl(name: string | null | undefined): string {
    // Use DiceBear "notionists" style for fun, unique animated-looking avatars
    const seed = name?.trim() || "anonymous";
    return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f0f0f0&radius=50`;
}

export const UserAvatar = memo(function UserAvatar({ name, image, className }: UserAvatarProps) {
    const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?";

    const avatarSrc = image || getAvatarUrl(name);

    return (
        <Avatar className={cn("border border-zinc-200/60 bg-zinc-50", className)}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <AvatarImage src={avatarSrc} alt={name || "User"} loading="lazy" />
            <AvatarFallback className="bg-zinc-50 text-zinc-600 text-[11px] font-medium tracking-wide">
                {initials}
            </AvatarFallback>
        </Avatar>
    );
});
