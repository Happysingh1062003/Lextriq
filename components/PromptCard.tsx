"use client";

import { memo, useMemo, useState } from "react";
import { ArrowUpRight, Copy, Eye, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn, formatCount } from "@/lib/utils";
import { UpvoteButton } from "@/components/UpvoteButton";
import type { PromptWithRelations } from "@/types";

interface PromptCardProps {
    prompt: PromptWithRelations;
    index?: number;
    isUpvoted?: boolean;
    isBookmarked?: boolean;
    showActions?: boolean;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const categoryStyles: Record<string, { bg: string; text: string }> = {
    Coding: { bg: "bg-[#F4F0EA]", text: "text-[#6D6B66]" },
    Developing: { bg: "bg-[#EAEFF0]", text: "text-[#646A6D]" },
    "UI/UX": { bg: "bg-[#EAEFF0]", text: "text-[#646A6D]" },
    Designing: { bg: "bg-[#EAEFF0]", text: "text-[#646A6D]" },
    Creatives: { bg: "bg-[#F0EAEB]", text: "text-[#6D6567]" },
    Creative: { bg: "bg-[#F0EAEB]", text: "text-[#6D6567]" },
    Writing: { bg: "bg-[#CDEDF6]", text: "text-[#5B7177]" },
    Marketing: { bg: "bg-[#FCE7F3]", text: "text-[#7B6A73]" },
    Other: { bg: "bg-[#F4F4F5]", text: "text-[#71717A]" },
};

export const PromptCard = memo(function PromptCard({
    prompt,
    index = 0,
    isUpvoted = false,
    isBookmarked = false,
}: PromptCardProps) {
    const [optimisticCopies, setOptimisticCopies] = useState(prompt.copyCount || 0);
    const [optimisticViews, setOptimisticViews] = useState(prompt.views || 0);
    const [optimisticUpvoteCount, setOptimisticUpvoteCount] = useState(prompt._count?.upvotes || 0);

    const style = categoryStyles[prompt.category] || categoryStyles.Other;

    // Staggered entrance
    const animStyle = useMemo(() => ({
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both' as const,
    }), [index]);

    const router = useRouter();

    const handleCardClick = () => {
        setOptimisticViews(prev => prev + 1); // Optimistic view count
        router.push(`/dashboard/prompt/${prompt.id}`);
    };

    const handleCopyClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Optimistic update
        setOptimisticCopies(prev => prev + 1);

        navigator.clipboard.writeText(prompt.content);

        // Fire copy API in background
        fetch(`/api/prompts/${prompt.id}/copy`, { method: "POST" }).catch(console.error);
    };

    const promptText = prompt.content?.length > 140
        ? prompt.content.substring(0, 140) + "..."
        : prompt.content;

    return (
        <div
            onClick={handleCardClick}
            style={animStyle}
            className={cn(
                "animate-fade-in rounded-xl p-6 md:p-8 transition-all hover:-translate-y-1.5 hover:shadow-md duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer flex flex-col h-full h-[340px] group relative overflow-hidden border border-black/[0.015] shadow-sm",
                style.bg
            )}
        >
            {/* Row 1: Category & Like */}
            <div className="flex items-center justify-between mb-6 relative z-20">
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-md text-[13px] font-medium text-zinc-900 shadow-sm">
                        {prompt.category}
                    </span>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <UpvoteButton
                        promptId={prompt.id}
                        initialCount={prompt._count?.upvotes || 0}
                        initialUpvoted={isUpvoted}
                        onToggle={(upvoted, count) => setOptimisticUpvoteCount(count)}
                    />
                </div>
            </div>

            {/* Row 2: Title */}
            <h3 className="text-[20px] md:text-[22px] leading-tight text-zinc-900 mb-4 relative z-20 line-clamp-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {prompt.title}
            </h3>

            {/* Row 3: Content Peek */}
            <div className="flex-1 overflow-hidden relative z-20" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}>
                <div className={cn("text-[13px] leading-relaxed whitespace-pre-line font-medium", style.text)}>
                    {promptText}
                </div>
            </div>

            {/* Row 4: Footer */}
            <div className="pt-5 mt-4 border-t border-black/10 flex items-center justify-between text-[14px] font-medium text-zinc-500 relative z-20">
                {/* Stats */}
                <div className="flex items-center gap-2.5 text-black/40">
                    <div className="flex items-center gap-1" title="Views">
                        <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span className="text-[11px] font-medium">{formatCount(optimisticViews)}</span>
                    </div>
                    {optimisticCopies > 0 && (
                        <div
                            className="flex items-center gap-1 cursor-pointer hover:text-black/70 transition-colors"
                            title="Copy"
                            onClick={handleCopyClick}
                        >
                            <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span className="text-[11px] font-medium">{formatCount(optimisticCopies)}</span>
                        </div>
                    )}
                    {(prompt._count?.comments || 0) > 0 && (
                        <div className="flex items-center gap-1" title="Comments">
                            <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span className="text-[11px] font-medium">{formatCount(prompt._count?.comments || 0)}</span>
                        </div>
                    )}
                </div>

                {/* Link */}
                <span className="flex items-center gap-1 font-semibold text-zinc-900 group-hover:text-zinc-900 transition-colors">
                    Use Prompt <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
            </div>
        </div>
    );
});
