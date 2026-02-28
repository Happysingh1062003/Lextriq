"use client";

import React from "react";
import {
    Bot,
    BrainCircuit,
    Sparkles,
    Code2,
    Cpu,
    Palette,
    Wand2,
    ImageIcon,
    Video,
    Search,
} from "lucide-react";

// Provider-based color matching — any model from that provider gets the color
const providerColors: [string, string][] = [
    // OpenAI
    ["GPT", "bg-emerald-50 text-emerald-700 border-emerald-200"],
    ["ChatGPT", "bg-emerald-50 text-emerald-700 border-emerald-200"],
    ["o1", "bg-emerald-50 text-emerald-700 border-emerald-200"],
    ["o3", "bg-emerald-50 text-emerald-700 border-emerald-200"],
    ["DALL-E", "bg-teal-50 text-teal-700 border-teal-200"],
    ["Sora", "bg-cyan-50 text-cyan-700 border-cyan-200"],
    // Anthropic
    ["Claude", "bg-orange-50 text-orange-700 border-orange-200"],
    // Google
    ["Gemini", "bg-blue-50 text-blue-700 border-blue-200"],
    // xAI
    ["Grok", "bg-red-50 text-red-700 border-red-200"],
    // Meta
    ["Llama", "bg-indigo-50 text-indigo-700 border-indigo-200"],
    // DeepSeek
    ["DeepSeek", "bg-sky-50 text-sky-700 border-sky-200"],
    // Mistral
    ["Mistral", "bg-orange-50 text-orange-700 border-orange-200"],
    // Coding
    ["GitHub Copilot", "bg-zinc-100 text-zinc-900 border-zinc-300"],
    ["Cursor", "bg-zinc-800 text-white border-zinc-700"],
    ["Codeium", "bg-lime-50 text-lime-700 border-lime-200"],
    ["Windsurf", "bg-teal-50 text-teal-700 border-teal-200"],
    ["Tabnine", "bg-violet-50 text-violet-700 border-violet-200"],
    // Image
    ["Midjourney", "bg-indigo-50 text-indigo-700 border-indigo-200"],
    ["Stable Diffusion", "bg-purple-50 text-purple-700 border-purple-200"],
    ["Leonardo", "bg-violet-50 text-violet-700 border-violet-200"],
    ["Ideogram", "bg-pink-50 text-pink-700 border-pink-200"],
    ["Flux", "bg-sky-50 text-sky-700 border-sky-200"],
    ["Adobe Firefly", "bg-red-50 text-red-700 border-red-200"],
    // Video
    ["Runway", "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200"],
    ["Pika", "bg-rose-50 text-rose-700 border-rose-200"],
    ["Kling", "bg-amber-50 text-amber-700 border-amber-200"],
    ["Veo", "bg-blue-50 text-blue-700 border-blue-200"],
    // Search
    ["Perplexity", "bg-sky-50 text-sky-700 border-sky-200"],
    ["Cohere", "bg-green-50 text-green-700 border-green-200"],
];

const providerIcons: [string, React.ElementType][] = [
    ["GPT", Bot],
    ["ChatGPT", Bot],
    ["o1", BrainCircuit],
    ["o3", BrainCircuit],
    ["DALL-E", ImageIcon],
    ["Sora", Video],
    ["Claude", BrainCircuit],
    ["Gemini", Sparkles],
    ["Grok", Bot],
    ["Llama", Bot],
    ["DeepSeek", Search],
    ["Mistral", Bot],
    ["GitHub Copilot", Code2],
    ["Cursor", Cpu],
    ["Codeium", Code2],
    ["Windsurf", Code2],
    ["Tabnine", Code2],
    ["Midjourney", Palette],
    ["Stable Diffusion", Wand2],
    ["Leonardo", Palette],
    ["Ideogram", ImageIcon],
    ["Flux", ImageIcon],
    ["Adobe Firefly", ImageIcon],
    ["Runway", Video],
    ["Pika", Video],
    ["Kling", Video],
    ["Veo", Video],
    ["Perplexity", Search],
    ["Cohere", Bot],
];

function getToolColor(tool: string): string {
    const match = providerColors.find(([prefix]) => tool.startsWith(prefix));
    return match?.[1] || "bg-zinc-50 text-zinc-600 border-zinc-200";
}

function getToolIcon(tool: string): React.ElementType {
    const match = providerIcons.find(([prefix]) => tool.startsWith(prefix));
    return match?.[1] || Bot;
}

// Exported for use in PromptCard
export { getToolColor as toolColors_get };
export const toolColors = new Proxy({} as Record<string, string>, {
    get: (_, key: string) => getToolColor(key),
});
export const toolIcons = new Proxy({} as Record<string, React.ElementType>, {
    get: (_, key: string) => getToolIcon(key),
});

interface AiToolBadgeProps {
    tool: string;
    monochrome?: boolean;
    className?: string;
}

export function AiToolBadge({ tool, monochrome, className }: AiToolBadgeProps) {
    const color = monochrome ? "bg-zinc-50 text-zinc-500 border-zinc-100" : getToolColor(tool);
    const Icon = getToolIcon(tool);

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${color} ${className || ""}`}>
            <Icon className="w-3 h-3" strokeWidth={1.8} />
            {tool}
        </span>
    );
}
