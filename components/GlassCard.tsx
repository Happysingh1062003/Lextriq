"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    children: React.ReactNode;
}

export function GlassCard({ hover = true, className, children, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card rounded-xl p-5 relative overflow-hidden",
                hover && "glass-card-hover",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
