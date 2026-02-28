import { Suspense } from "react";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PromptCard } from "@/components/PromptCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { getPrompts, getUserInteractionState } from "@/lib/queries";
import type { PromptWithRelations } from "@/types";

async function TrendingFeed({ userId }: { userId?: string }) {
    const data = await getPrompts({ sort: "trending", limit: 3 });
    const prompts = data.prompts || [];
    const interactionState = await getUserInteractionState(userId, prompts.map(p => p.id));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map((prompt) => (
                <PromptCard
                    key={prompt.id}
                    prompt={prompt as unknown as PromptWithRelations}
                    isUpvoted={interactionState.upvotedIds.has(prompt.id)}
                    isBookmarked={interactionState.bookmarkedIds.has(prompt.id)}
                />
            ))}
        </div>
    );
}

async function RecentFeed({ userId }: { userId?: string }) {
    const data = await getPrompts({ sort: "newest", limit: 6 });
    const prompts = data.prompts || [];
    const interactionState = await getUserInteractionState(userId, prompts.map(p => p.id));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prompts.map((prompt) => (
                <PromptCard
                    key={prompt.id}
                    prompt={prompt as unknown as PromptWithRelations}
                    isUpvoted={interactionState.upvotedIds.has(prompt.id)}
                    isBookmarked={interactionState.bookmarkedIds.has(prompt.id)}
                />
            ))}
        </div>
    );
}

export default async function DashboardFeedPage() {
    const session = await auth();
    const userId = session?.user?.id;
    const firstName = session?.user?.name?.split(" ")[0] || "there";

    return (
        <div className="space-y-20 max-w-6xl">

            {/* Welcome Greeting */}
            <section className="animate-fade-in">
                <h2 className="text-[28px] font-normal tracking-tight text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.03em" }}>
                    Hey, {firstName} 👋
                </h2>
            </section>

            {/* Trending */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[20px] font-normal text-zinc-900 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Trending
                    </h3>
                    <Link
                        href="/dashboard/discover?sort=trending"
                        className="text-[13.5px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 group"
                    >
                        View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                }>
                    <TrendingFeed userId={userId} />
                </Suspense>
            </section>

            {/* Recently Added */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[20px] font-normal text-zinc-900 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Recently Added
                    </h3>
                    <Link
                        href="/dashboard/discover?sort=newest"
                        className="text-[13.5px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 group"
                    >
                        View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                }>
                    <RecentFeed userId={userId} />
                </Suspense>
            </section>
        </div>
    );
}

