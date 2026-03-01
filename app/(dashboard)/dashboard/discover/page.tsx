import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Discover Prompts",
    description: "Search and discover the best AI prompts across all categories.",
};
import { getPrompts, getUserInteractionState } from "@/lib/queries";
import { auth } from "@/lib/auth";
import DiscoverContent from "./DiscoverContent";
import { SkeletonCard } from "@/components/SkeletonCard";



async function DiscoverFeed({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const categoryQuery = typeof searchParams.category === 'string' ? searchParams.category : Array.isArray(searchParams.category) ? searchParams.category.join(',') : undefined;
    const aiToolQuery = typeof searchParams.aiTool === 'string' ? searchParams.aiTool : Array.isArray(searchParams.aiTool) ? searchParams.aiTool.join(',') : undefined;

    const session = await auth();
    const userId = session?.user?.id;

    // Fetch initial data on the server
    const initialData = await getPrompts({
        search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
        category: categoryQuery,
        aiTool: aiToolQuery,
        difficulty: typeof searchParams.difficulty === 'string' ? searchParams.difficulty : undefined,
        sort: typeof searchParams.sort === 'string' ? searchParams.sort : "trending",
        page: 1,
        limit: 12,
    });

    const initialInteractionState = await getUserInteractionState(userId, initialData.prompts.map(p => p.id));

    return (
        <DiscoverContent
            initialPrompts={initialData.prompts as any}
            initialTotal={initialData.total}
            interactionState={{
                upvotedIds: initialInteractionState.upvotedIds,
                bookmarkedIds: initialInteractionState.bookmarkedIds
            }}
        />
    );
}

export default async function DiscoverPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="h-[200px] w-full bg-zinc-100 rounded-2xl animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        }>
            <DiscoverFeed searchParams={searchParams} />
        </Suspense>
    );
}
