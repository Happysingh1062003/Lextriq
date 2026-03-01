import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Manage your saved and see the latest AI prompts.",
};
import { auth } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PromptCard } from "@/components/PromptCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { getPrompts, getUserInteractionState } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import type { PromptWithRelations } from "@/types";
import { OnboardingProgress } from "@/components/OnboardingProgress";

/* ── Generic feed component driven by sort param ── */
async function PromptFeed({ userId, sort, limit = 3 }: { userId?: string; sort: string; limit?: number }) {
    const data = await getPrompts({ sort, limit });
    const prompts = data.prompts || [];
    const interactionState = await getUserInteractionState(userId, prompts.map(p => p.id));

    if (prompts.length === 0) {
        return (
            <p className="text-sm text-zinc-400 py-8 text-center">No prompts yet.</p>
        );
    }

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

/* ── Section config ── */
const sections = [
    {
        title: "Most Copied",
        sort: "copies",
        discoverSort: "copies",
        limit: 3,
    },
    {
        title: "Most Liked",
        sort: "upvotes",
        discoverSort: "upvotes",
        limit: 3,
    },
    {
        title: "Most Seen",
        sort: "views",
        discoverSort: "views",
        limit: 3,
    },
    {
        title: "Recently Added",
        sort: "newest",
        discoverSort: "newest",
        limit: 6,
    },
];

export default async function DashboardFeedPage() {
    const session = await auth();
    const userId = session?.user?.id;
    const firstName = session?.user?.name?.split(" ")[0] || "there";

    // Lightweight onboarding state queries
    const [savedCount, uploadedCount] = userId
        ? await Promise.all([
            prisma.bookmark.count({ where: { userId } }),
            prisma.prompt.count({ where: { authorId: userId } }),
        ])
        : [0, 0];

    return (
        <div className="space-y-20 max-w-6xl">

            {/* Welcome Greeting */}
            <section className="animate-fade-in space-y-6">
                <h2 className="text-[28px] font-normal tracking-tight text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.03em" }}>
                    Hey, {firstName} 👋
                </h2>

                {/* Onboarding Progress */}
                <OnboardingProgress
                    hasSavedPrompt={savedCount > 0}
                    hasUploadedPrompt={uploadedCount > 0}
                />
            </section>

            {/* Feed Sections */}
            {sections.map((section) => {
                return (
                    <section key={section.sort}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[20px] font-normal text-zinc-900 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                {section.title}
                            </h3>
                            <Link
                                href={`/dashboard/discover?sort=${section.discoverSort}`}
                                className="text-[13.5px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1 group"
                            >
                                View all <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                        <Suspense fallback={
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: section.limit }).map((_, i) => <SkeletonCard key={i} />)}
                            </div>
                        }>
                            <PromptFeed userId={userId} sort={section.sort} limit={section.limit} />
                        </Suspense>
                    </section>
                );
            })}
        </div>
    );
}
