"use client";

import { FileQuestion } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    action?: { label: string; href?: string; onClick?: () => void };
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
    action,
}: EmptyStateProps) {
    const label = action?.label || actionLabel;
    const href = action?.href || actionHref;
    const onClick = action?.onClick || onAction;

    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                {icon || <FileQuestion className="w-5 h-5 text-zinc-300" />}
            </div>
            <h3 className="text-[15px] font-semibold text-zinc-900 mb-1 tracking-tight">
                {title}
            </h3>
            <p className="text-[13px] text-zinc-400 max-w-xs mb-6 leading-relaxed">
                {description}
            </p>
            {label && (
                href ? (
                    <Link href={href}>
                        <button className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-[12px] font-medium hover:bg-zinc-800 transition-colors">
                            {label}
                        </button>
                    </Link>
                ) : (
                    <button
                        onClick={onClick}
                        className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-[12px] font-medium hover:bg-zinc-800 transition-colors"
                    >
                        {label}
                    </button>
                )
            )}
        </div>
    );
}
