"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { PromptCard } from "@/components/PromptCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { FilterBar, type FilterState } from "@/components/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { Search } from "lucide-react";
import type { PromptWithRelations } from "@/types";

export default function DiscoverContent({ initialPrompts, initialTotal, interactionState }: { initialPrompts: PromptWithRelations[], initialTotal: number, interactionState?: { upvotedIds: Set<string>, bookmarkedIds: Set<string> } }) {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const [prompts, setPrompts] = useState<PromptWithRelations[]>(initialPrompts);
    const [total, setTotal] = useState(initialTotal);
    const pageRef = useRef(1);
    const [isLoading, setIsLoading] = useState(false);
    const isLoadingMoreRef = useRef(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const hasMoreRef = useRef(initialPrompts.length < initialTotal);
    const isFirstRender = useRef(true);
    const filtersRef = useRef<FilterState>({
        search: searchParams.get("search") || "",
        categories: searchParams.getAll("category"),
        aiTools: searchParams.getAll("aiTool"),
        difficulty: searchParams.get("difficulty") || "",
        sort: searchParams.get("sort") || "trending",
    });
    const scrollThrottleRef = useRef(false);

    const buildQueryString = useCallback((filters: FilterState, pageNum: number, currentUserId?: string) => {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.categories.length) params.set("category", filters.categories.join(","));
        if (filters.aiTools.length) params.set("aiTool", filters.aiTools.join(","));
        if (filters.difficulty) params.set("difficulty", filters.difficulty);
        if (filters.sort) params.set("sort", filters.sort);
        if (currentUserId) params.set("userId", currentUserId);
        params.set("page", pageNum.toString());
        params.set("limit", "12");
        return params.toString();
    }, []);

    const fetchPrompts = useCallback(
        async (filters: FilterState, pageNum: number, append: boolean = false, currentUserId?: string) => {
            if (!append) setIsLoading(true);
            else {
                setIsLoadingMore(true);
                isLoadingMoreRef.current = true;
            }

            try {
                const query = buildQueryString(filters, pageNum, currentUserId);
                const res = await fetch(`/api/prompts?${query}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();

                if (append) {
                    setPrompts((prev) => [...prev, ...(data.prompts || [])]);
                } else {
                    setPrompts(data.prompts || []);
                }
                setTotal(data.total || 0);
                const more = pageNum < (data.totalPages || 1);
                hasMoreRef.current = more;
            } catch (error) {
                console.error("Error fetching prompts:", error);
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
                isLoadingMoreRef.current = false;
            }
        },
        [buildQueryString]
    );

    // Re-fetch when URL params change (e.g., Topbar search navigation)
    const searchParamString = searchParams.toString();
    const currentUserId = useMemo(() => session?.user?.id, [session]);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        pageRef.current = 1;
        hasMoreRef.current = true;
        const currentFilters: FilterState = {
            search: searchParams.get("search") || "",
            categories: searchParams.getAll("category"),
            aiTools: searchParams.getAll("aiTool"),
            difficulty: searchParams.get("difficulty") || "",
            sort: searchParams.get("sort") || "trending",
        };
        filtersRef.current = currentFilters;
        fetchPrompts(currentFilters, 1, false, currentUserId);
    }, [searchParamString, fetchPrompts, searchParams, currentUserId]);

    const handleFilterChange = useCallback(
        (filters: FilterState) => {
            pageRef.current = 1;
            hasMoreRef.current = true;
            filtersRef.current = filters;
            fetchPrompts(filters, 1, false, currentUserId);
        },
        [fetchPrompts, currentUserId]
    );

    // Infinite scroll — throttled + uses refs to avoid stale closures
    useEffect(() => {
        const handleScroll = () => {
            if (scrollThrottleRef.current) return;
            scrollThrottleRef.current = true;
            setTimeout(() => { scrollThrottleRef.current = false; }, 150);

            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 300
            ) {
                if (!isLoadingMoreRef.current && hasMoreRef.current) {
                    const newPage = pageRef.current + 1;
                    pageRef.current = newPage;
                    fetchPrompts(filtersRef.current, newPage, true, currentUserId);
                }
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchPrompts, currentUserId]);

    const userId = currentUserId;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <FilterBar onFilterChange={handleFilterChange} />

            {/* Results count */}
            <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-zinc-400">
                    {total} {total === 1 ? "prompt" : "prompts"}
                </span>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : prompts.length === 0 ? (
                <EmptyState
                    icon={<Search className="w-8 h-8 text-zinc-300" />}
                    title="No prompts found"
                    description="Try different filters or search terms."
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {prompts.map((prompt, i) => (
                            <div key={prompt.id} className="relative group/discover h-full">
                                <PromptCard
                                    prompt={prompt}
                                    isUpvoted={interactionState?.upvotedIds?.has(prompt.id) || prompt.upvotes?.some((u: any) => u.userId === userId)}
                                    isBookmarked={interactionState?.bookmarkedIds?.has(prompt.id) || prompt.bookmarks?.some((b: any) => b.userId === userId)}
                                />
                            </div>
                        ))}
                    </div>

                    {isLoadingMore && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
