import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "AI Prompt Library | Lextriq",
    description: "Browse thousands of curated AI prompts organized by tool and category. Find the perfect prompt for ChatGPT, Claude, Gemini, Midjourney, and more.",
    openGraph: {
        title: "AI Prompt Library | Lextriq",
        description: "Browse thousands of curated AI prompts organized by tool and category.",
        type: "website",
        url: "https://lextriq.com/prompts",
        siteName: "Lextriq",
    },
};

const FEATURED_TOOLS = [
    { slug: "chatgpt", label: "ChatGPT", description: "The world's most popular AI assistant" },
    { slug: "claude", label: "Claude", description: "Anthropic's reasoning-first AI" },
    { slug: "gemini", label: "Gemini", description: "Google's multimodal AI model" },
    { slug: "gpt-4o", label: "GPT-4o", description: "OpenAI's flagship multimodal model" },
    { slug: "midjourney", label: "Midjourney", description: "Premium AI image generation" },
    { slug: "dall-e-3", label: "DALL-E 3", description: "OpenAI's image generation model" },
    { slug: "cursor", label: "Cursor", description: "AI-powered code editor" },
    { slug: "github-copilot", label: "GitHub Copilot", description: "AI pair programming assistant" },
];

const FEATURED_CATEGORIES = [
    { slug: "coding", label: "Coding" },
    { slug: "marketing", label: "Marketing" },
    { slug: "writing", label: "Writing" },
    { slug: "creative", label: "Creative" },
    { slug: "designing", label: "Designing" },
    { slug: "business", label: "Business" },
    { slug: "education", label: "Education" },
    { slug: "productivity", label: "Productivity" },
];

export default function PromptsHubPage() {
    return (
        <div className="min-h-screen bg-[#F6F6F6]">
            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* Hero */}
                <header className="mb-16 text-center">
                    <h1
                        className="text-[40px] md:text-[56px] font-normal tracking-tight text-[#1A1A1A] mb-4"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.03em" }}
                    >
                        AI Prompt Library
                    </h1>
                    <p className="text-zinc-500 text-[16px] max-w-lg mx-auto leading-relaxed">
                        Thousands of community-tested prompts organized by tool and category. Find, copy, and use instantly.
                    </p>
                </header>

                {/* Browse by Tool */}
                <section className="mb-16">
                    <h2
                        className="text-[24px] font-normal text-zinc-900 mb-6"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Browse by Tool
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {FEATURED_TOOLS.map((tool) => (
                            <div key={tool.slug} className="bg-white border border-black/5 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                                <h3 className="text-[15px] font-semibold text-zinc-900 mb-1">{tool.label}</h3>
                                <p className="text-[12px] text-zinc-400 mb-4">{tool.description}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {FEATURED_CATEGORIES.slice(0, 4).map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/prompts/${tool.slug}/${cat.slug}`}
                                            className="text-[11px] px-2.5 py-1 bg-black/[0.03] hover:bg-black/[0.07] rounded-md text-zinc-600 transition-colors"
                                        >
                                            {cat.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Browse by Category */}
                <section className="mb-16">
                    <h2
                        className="text-[24px] font-normal text-zinc-900 mb-6"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        Browse by Category
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {FEATURED_CATEGORIES.map((cat) => (
                            <div key={cat.slug} className="bg-white border border-black/5 rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                <h3 className="text-[15px] font-semibold text-zinc-900 mb-3">{cat.label}</h3>
                                <div className="space-y-1.5">
                                    {FEATURED_TOOLS.slice(0, 3).map((tool) => (
                                        <Link
                                            key={tool.slug}
                                            href={`/prompts/${tool.slug}/${cat.slug}`}
                                            className="flex items-center justify-between text-[12px] text-zinc-500 hover:text-zinc-900 transition-colors group/link"
                                        >
                                            <span>{tool.label}</span>
                                            <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <div className="text-center bg-white border border-black/5 rounded-xl p-10">
                    <h3 className="text-[22px] font-normal text-zinc-900 mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Join the community
                    </h3>
                    <p className="text-zinc-500 text-[14px] mb-6 max-w-md mx-auto">
                        Sign up for free to save prompts, upload your own, and get featured.
                    </p>
                    <Link
                        href="/auth/signin"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full text-[14px] font-semibold hover:bg-zinc-800 transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </div>
        </div>
    );
}
