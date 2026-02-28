"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Code, Rocket, Palette, Sparkles, Hash } from "lucide-react";

const categoryColors: Record<string, string> = {
    Coding: "bg-blue-50 text-blue-700 border-blue-200",
    Developing: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Debugging: "bg-orange-50 text-orange-700 border-orange-200",
    "UI/UX": "bg-purple-50 text-purple-700 border-purple-200",
    Designing: "bg-purple-50 text-purple-700 border-purple-200",
    Creative: "bg-rose-50 text-rose-700 border-rose-200",
    Creatives: "bg-rose-50 text-rose-700 border-rose-200",
    Writing: "bg-amber-50 text-amber-700 border-amber-200",
    Marketing: "bg-pink-50 text-pink-700 border-pink-200",
    "Data Analysis": "bg-cyan-50 text-cyan-700 border-cyan-200",
    Education: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Business: "bg-slate-50 text-slate-700 border-slate-200",
    Productivity: "bg-teal-50 text-teal-700 border-teal-200",
    Other: "bg-zinc-50 text-zinc-500 border-zinc-100",
};

export const categoryIcons: Record<string, React.ElementType> = {
    Coding: Code,
    Developing: Rocket,
    Debugging: Code,
    "UI/UX": Palette,
    Designing: Palette,
    Creative: Sparkles,
    Creatives: Sparkles,
    Writing: Hash,
    Marketing: Sparkles,
    "Data Analysis": Hash,
    Education: Hash,
    Business: Rocket,
    Productivity: Rocket,
    Other: Hash,
};

export const CategoryBadge = memo(function CategoryBadge({
    category,
    className,
}: {
    category: string;
    className?: string;
}) {
    const Icon = categoryIcons[category] || categoryIcons.Other;

    return (
        <Badge
            variant="outline"
            className={cn(
                "text-[11px] font-medium border duration-200 transition-colors px-2 py-0.5 rounded-md flex items-center gap-1.5 w-fit",
                categoryColors[category] || categoryColors.Other,
                className
            )}
        >
            <Icon className="w-3 h-3" strokeWidth={2.5} />
            {category === "Creative" ? "Creatives" : category}
        </Badge>
    );
});
