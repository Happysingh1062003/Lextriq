import { auth } from "@/lib/auth";
import { Bookmark } from "lucide-react";
import { PromptCard } from "@/components/PromptCard";
import { EmptyState } from "@/components/EmptyState";
import { getUserBookmarks } from "@/lib/queries";



export default async function SavedPage() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return null;

    const prompts = await getUserBookmarks(userId);

    return (
        <div className="space-y-6 max-w-6xl">
            {prompts.length === 0 ? (
                <EmptyState
                    icon={<Bookmark className="w-5 h-5 text-zinc-300" />}
                    title="No saved prompts yet"
                    description="Bookmark prompts you like and they'll show up here."
                    action={{ label: "Browse Prompts", href: "/dashboard/discover" }}
                />
            ) : (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-[24px] font-normal tracking-tight text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.03em" }}>
                                Saved Prompts
                            </h2>
                            <p className="text-[13px] text-zinc-500 mt-1">Your personal collection of bookmarked formulas.</p>
                        </div>
                        <span className="text-[12px] font-medium text-zinc-400">
                            {prompts.length} {prompts.length === 1 ? "prompt" : "prompts"}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {prompts.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt as any}
                                isUpvoted={prompt.upvotes?.some((u: any) => u.userId === userId)}
                                isBookmarked={true}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
