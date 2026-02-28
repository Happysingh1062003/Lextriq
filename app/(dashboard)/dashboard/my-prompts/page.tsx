import { auth } from "@/lib/auth";
import Link from "next/link";
import {
    Eye,
    PlusCircle,
    Copy,
    ArrowUpFromLine
} from "lucide-react";
import { PromptCard } from "@/components/PromptCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { getUserPrompts, getUserStats } from "@/lib/queries";
import { DeletePromptButton } from "@/components/DeletePromptButton";



export default async function MyPromptsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return null;
    }

    const [prompts, stats] = await Promise.all([
        getUserPrompts(userId),
        getUserStats(userId),
    ]);

    const statItems = [
        { label: "Prompts Created", value: stats.totalPrompts },
        { label: "Total Views", value: stats.totalViews },
        { label: "Total Upvotes", value: stats.totalUpvotes },
        { label: "Total Copies", value: stats.totalCopies },
    ];

    return (
        <div className="space-y-10 max-w-6xl mx-auto">
            {/* Minimalist Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map((stat) => (
                    <div key={stat.label} className="bg-transparent border border-black/5 rounded-2xl p-5 hover:bg-black/5 transition-colors">
                        <p className="text-[12px] text-zinc-500 font-medium mb-1.5">{stat.label}</p>
                        <p className="text-3xl font-semibold text-zinc-900 tracking-tight">
                            {stat.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-[24px] font-normal tracking-tight text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.03em" }}>
                        My Prompts
                    </h2>
                    <p className="text-[13px] text-zinc-500 mt-1">Manage and edit your shared formulas.</p>
                </div>
                <Link href="/dashboard/upload">
                    <button className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white rounded-full px-5 py-2 text-[13px] font-semibold transition-colors shadow-sm">
                        <PlusCircle className="w-4 h-4" /> New
                    </button>
                </Link>
            </div>

            {/* Grid */}
            {prompts.length === 0 ? (
                <EmptyState
                    icon={<PlusCircle className="w-6 h-6 text-zinc-300" />}
                    title="No prompts yet"
                    description="Share your first AI prompt with the community!"
                    action={{ label: "Upload Prompt", href: "/dashboard/upload" }}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {prompts.map((prompt) => (
                        <div key={prompt.id} className="relative group/my-prompt">
                            <PromptCard
                                prompt={prompt as any}
                                isUpvoted={prompt.upvotes?.some((u: any) => u.userId === userId)}
                                isBookmarked={prompt.bookmarks?.some((b: any) => b.userId === userId)}
                            />
                            <DeletePromptButton promptId={prompt.id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
