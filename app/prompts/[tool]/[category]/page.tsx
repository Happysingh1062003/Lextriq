import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { getPrompts } from "@/lib/queries";
import { CATEGORIES, AI_TOOLS } from "@/types";

interface PageProps {
    params: Promise<{ tool: string; category: string }>;
}

function slugToLabel(slug: string): string {
    return decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function findTool(slug: string): string | undefined {
    const label = slugToLabel(slug);
    return AI_TOOLS.find(
        (t) => t.toLowerCase() === label.toLowerCase()
    );
}

function findCategory(slug: string): string | undefined {
    const label = slugToLabel(slug);
    return CATEGORIES.find(
        (c) => c.toLowerCase() === label.toLowerCase()
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { tool, category } = await params;
    const toolLabel = findTool(tool) || slugToLabel(tool);
    const catLabel = findCategory(category) || slugToLabel(category);

    const title = `Top ${toolLabel} Prompts for ${catLabel} | Lextriq`;
    const description = `Discover the best ${toolLabel} prompts for ${catLabel}. Curated, community-tested AI prompts to supercharge your workflow.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `https://lextriq.com/prompts/${tool}/${category}`,
            siteName: "Lextriq",
            images: [{
                url: `https://lextriq.com/api/og?title=${encodeURIComponent(`Top ${toolLabel} Prompts for ${catLabel}`)}&category=${encodeURIComponent(catLabel)}`,
                width: 1200,
                height: 630,
            }],
        },
        twitter: { card: "summary_large_image", title, description },
    };
}

// Pre-render the most popular combinations
export async function generateStaticParams() {
    const topTools = ["chatgpt", "claude", "gemini", "midjourney", "gpt-4o"];
    const topCategories = ["coding", "marketing", "writing", "creative", "designing"];

    const params: { tool: string; category: string }[] = [];
    for (const tool of topTools) {
        for (const category of topCategories) {
            params.push({ tool, category });
        }
    }
    return params;
}

export default async function PromptSEOPage({ params }: PageProps) {
    const { tool, category } = await params;
    const toolLabel = findTool(tool) || slugToLabel(tool);
    const catLabel = findCategory(category) || slugToLabel(category);

    const data = await getPrompts({
        aiTool: toolLabel,
        category: catLabel,
        sort: "trending",
        limit: 50,
    });

    const prompts = data.prompts || [];

    return (
        <div className="min-h-screen bg-[#F6F6F6]">
            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
                    <Link href="/prompts" className="hover:text-zinc-900 transition-colors">Prompts</Link>
                    <span>→</span>
                    <span>{toolLabel}</span>
                    <span>→</span>
                    <span className="text-zinc-900">{catLabel}</span>
                </nav>

                {/* Hero */}
                <header className="mb-12">
                    <h1
                        className="text-[36px] md:text-[48px] font-normal tracking-tight text-[#1A1A1A] mb-4"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.03em" }}
                    >
                        Top {toolLabel} Prompts for {catLabel}
                    </h1>
                    <p className="text-zinc-500 text-[16px] max-w-2xl leading-relaxed">
                        {prompts.length > 0
                            ? `${data.total} community-tested prompts to supercharge your ${catLabel.toLowerCase()} workflow with ${toolLabel}.`
                            : `No prompts found yet for ${catLabel} with ${toolLabel}. Be the first to contribute!`
                        }
                    </p>
                </header>

                {/* Prompt List */}
                {prompts.length > 0 ? (
                    <div className="space-y-4">
                        {prompts.map((prompt, i) => (
                            <Link
                                key={prompt.id}
                                href={`/dashboard/prompt/${prompt.id}`}
                                className="group block bg-white border border-black/5 rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[11px] font-medium text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                                            <span className="px-2 py-0.5 bg-black/5 rounded text-[11px] font-medium text-zinc-600">
                                                {prompt.category}
                                            </span>
                                        </div>
                                        <h2 className="text-[18px] font-medium text-zinc-900 mb-1 group-hover:text-black transition-colors">
                                            {prompt.title}
                                        </h2>
                                        <p className="text-[13px] text-zinc-500 line-clamp-2">
                                            {prompt.description || prompt.content?.slice(0, 120) + "…"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 text-[12px] text-zinc-400 flex-shrink-0 pt-1">
                                        <span>▲ {prompt._count?.upvotes || 0}</span>
                                        <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-zinc-400 text-[15px] mb-4">No prompts here yet.</p>
                        <Link
                            href="/dashboard/upload"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-[13px] font-semibold hover:bg-zinc-800 transition-colors"
                        >
                            Upload the first prompt
                        </Link>
                    </div>
                )}

                {/* CTA */}
                {prompts.length > 0 && (
                    <div className="mt-16 text-center bg-white border border-black/5 rounded-xl p-10">
                        <h3 className="text-[22px] font-normal text-zinc-900 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            Ready to use these prompts?
                        </h3>
                        <p className="text-zinc-500 text-[14px] mb-6 max-w-md mx-auto">
                            Sign up for free to copy, save, and organize your favorite AI workflows.
                        </p>
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full text-[14px] font-semibold hover:bg-zinc-800 transition-colors"
                        >
                            Get Started Free
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
