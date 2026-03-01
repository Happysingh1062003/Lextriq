"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ChevronDown, SlidersHorizontal, Sparkles, Check } from "lucide-react";
import { CATEGORIES, AI_TOOLS, SORT_OPTIONS } from "@/types";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
    search: string;
    categories: string[];
    aiTools: string[];
    difficulty: string;
    sort: string;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<FilterState>({
        search: searchParams.get("search") || "",
        categories: searchParams.getAll("category"),
        aiTools: searchParams.getAll("aiTool"),
        difficulty: searchParams.get("difficulty") || "",
        sort: searchParams.get("sort") || "trending",
    });

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside to close and cleanup timers
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        };
    }, []);

    const updateFilters = useCallback(
        (newFilters: Partial<FilterState>) => {
            const updated = { ...filters, ...newFilters };
            setFilters(updated);
            onFilterChange?.(updated);

            const params = new URLSearchParams();
            if (updated.search) params.set("search", updated.search);
            updated.categories.forEach((c) => params.append("category", c));
            updated.aiTools.forEach((t) => params.append("aiTool", t));
            if (updated.sort && updated.sort !== "trending")
                params.set("sort", updated.sort);

            router.replace(`/dashboard/discover?${params.toString()}`, {
                scroll: false,
            });
        },
        [filters, onFilterChange, router]
    );

    const toggleCategory = (cat: string) => {
        const newCats = filters.categories.includes(cat)
            ? filters.categories.filter((c) => c !== cat)
            : [...filters.categories, cat];
        updateFilters({ categories: newCats });
    };

    const toggleTool = (tool: string) => {
        const newTools = filters.aiTools.includes(tool)
            ? filters.aiTools.filter((t) => t !== tool)
            : [...filters.aiTools, tool];
        updateFilters({ aiTools: newTools });
    };

    const clearFilters = () => {
        const cleared: FilterState = {
            search: "",
            categories: [],
            aiTools: [],
            difficulty: "",
            sort: "trending",
        };
        setFilters(cleared);
        onFilterChange?.(cleared);
        router.replace("/dashboard/discover", { scroll: false });
    };

    const hasActiveFilters =
        filters.search ||
        filters.categories.length > 0 ||
        filters.aiTools.length > 0;

    const activeCount =
        filters.categories.length +
        filters.aiTools.length +
        (filters.difficulty ? 1 : 0);

    return (
        <div className="space-y-3" ref={dropdownRef}>
            {/* Filter Bar Container */}
            <div className="py-2 relative">
                <div className="flex flex-wrap items-center gap-1.5">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px] max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-zinc-400" />
                        </div>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFilters((prev) => ({ ...prev, search: val }));
                                if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
                                searchTimerRef.current = setTimeout(() => {
                                    updateFilters({ search: val });
                                }, 300);
                            }}
                            placeholder="Search prompts..."
                            className="w-full bg-black/5 rounded-xl pl-9 pr-9 py-2.5 text-[13px] text-zinc-900 placeholder:text-zinc-500 font-medium focus:outline-none focus:bg-black/10 focus:ring-2 focus:ring-black/5 transition-all border border-transparent"
                        />
                        {filters.search && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button
                                    onClick={() => updateFilters({ search: "" })}
                                    className="text-zinc-400 hover:text-zinc-600 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-zinc-100 mx-0.5 hidden sm:block" />

                    {/* Category Filter */}
                    <div className="max-sm:static sm:relative flex-shrink-0">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
                            className={cn(
                                "flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all whitespace-nowrap border",
                                filters.categories.length > 0
                                    ? "bg-violet-50 text-violet-700 border-violet-200"
                                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 border-transparent"
                            )}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Category
                            {filters.categories.length > 0 && (
                                <span className="bg-violet-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {filters.categories.length}
                                </span>
                            )}
                            <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", openDropdown === "category" && "rotate-180")} />
                        </button>
                        {openDropdown === "category" && (
                            <div className="absolute top-full mt-2 max-sm:left-0 max-sm:right-0 sm:left-0 max-sm:w-auto max-sm:mx-1 sm:w-52 max-h-64 overflow-y-auto bg-white border border-zinc-100 rounded-2xl p-1.5 z-[60] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] animate-fade-in">
                                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-3 py-1.5">Categories</p>
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-medium transition-colors",
                                            filters.categories.includes(cat)
                                                ? "bg-violet-50 text-violet-700"
                                                : "text-zinc-600 hover:bg-zinc-50"
                                        )}
                                    >
                                        {cat}
                                        {filters.categories.includes(cat) && (
                                            <Check className="w-3.5 h-3.5 text-violet-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* AI Tool Filter */}
                    <div className="max-sm:static sm:relative flex-shrink-0">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === "tool" ? null : "tool")}
                            className={cn(
                                "flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all whitespace-nowrap border",
                                filters.aiTools.length > 0
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 border-transparent"
                            )}
                        >
                            AI Tool
                            {filters.aiTools.length > 0 && (
                                <span className="bg-blue-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {filters.aiTools.length}
                                </span>
                            )}
                            <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", openDropdown === "tool" && "rotate-180")} />
                        </button>
                        {openDropdown === "tool" && (
                            <div className="absolute top-full mt-2 max-sm:left-0 max-sm:right-0 sm:left-0 max-sm:w-auto max-sm:mx-1 sm:w-56 max-h-72 overflow-y-auto bg-white border border-zinc-100 rounded-2xl p-1.5 z-[60] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] animate-fade-in">
                                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-3 py-1.5">AI Tools</p>
                                {AI_TOOLS.map((tool) => (
                                    <button
                                        key={tool}
                                        onClick={() => toggleTool(tool)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-medium transition-colors",
                                            filters.aiTools.includes(tool)
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-zinc-600 hover:bg-zinc-50"
                                        )}
                                    >
                                        {tool}
                                        {filters.aiTools.includes(tool) && (
                                            <Check className="w-3.5 h-3.5 text-blue-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-5 bg-zinc-100 mx-0.5 flex-shrink-0" />

                    {/* Sort */}
                    <div className="max-sm:static sm:relative flex-shrink-0">
                        <button
                            onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
                            className={cn(
                                "flex items-center gap-1.5 pl-3 pr-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all whitespace-nowrap border",
                                filters.sort !== "trending"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 border-transparent"
                            )}
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            {SORT_OPTIONS.find(o => o.value === filters.sort)?.label || "Trending"}
                            <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", openDropdown === "sort" && "rotate-180")} />
                        </button>
                        {openDropdown === "sort" && (
                            <div className="absolute top-full mt-2 max-sm:left-0 max-sm:right-0 sm:right-0 max-sm:w-auto max-sm:mx-1 sm:w-44 bg-white border border-zinc-100 rounded-2xl p-1.5 z-[60] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] animate-fade-in">
                                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-3 py-1.5">Sort by</p>
                                {SORT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            updateFilters({ sort: opt.value });
                                            setOpenDropdown(null);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-medium transition-colors",
                                            filters.sort === opt.value
                                                ? "bg-zinc-900 text-white"
                                                : "text-zinc-600 hover:bg-zinc-50"
                                        )}
                                    >
                                        {opt.label}
                                        {filters.sort === opt.value && (
                                            <Check className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Clear All */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-[11px] text-red-400 hover:text-red-500 font-medium transition-colors ml-1 flex items-center gap-1 whitespace-nowrap"
                        >
                            <X className="w-3 h-3" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {filters.categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 text-[11px] font-medium hover:bg-violet-100 transition-colors"
                        >
                            {cat}
                            <X className="w-3 h-3" />
                        </button>
                    ))}
                    {filters.aiTools.map((tool) => (
                        <button
                            key={tool}
                            onClick={() => toggleTool(tool)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium hover:bg-blue-100 transition-colors"
                        >
                            {tool}
                            <X className="w-3 h-3" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
