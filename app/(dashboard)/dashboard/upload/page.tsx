"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, X, FileText, Image as ImageIcon, Code, Rocket, Palette } from "lucide-react";
import { AiToolBadge } from "@/components/AiToolBadge";
import { categoryIcons } from "@/components/CategoryBadge";
import { CATEGORIES, AI_TOOLS } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UploadDropzone } from "@/lib/uploadthing";

export default function UploadPromptPage() {
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdId, setCreatedId] = useState("");

    // Form state
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [aiTools, setAiTools] = useState<string[]>([]);
    const [resultType, setResultType] = useState<"text" | "image">("text");
    const [resultContent, setResultContent] = useState("");
    const [resultImages, setResultImages] = useState<string[]>([]);

    const toggleAiTool = (tool: string) => {
        setAiTools((prev) =>
            prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
        );
    };

    const removeImage = (url: string) => {
        setResultImages((prev) => prev.filter((i) => i !== url));
    };

    const validateForm = (): boolean => {
        if (!title.trim()) { toast.error("Title is required"); return false; }
        if (!content.trim()) { toast.error("Prompt content is required"); return false; }
        if (!category) { toast.error("Please select a category"); return false; }
        if (aiTools.length === 0) { toast.error("Please select at least one AI tool"); return false; }
        if (!resultContent.trim() && resultImages.length === 0) {
            toast.error("Please add at least one result (text or image)");
            return false;
        }
        return true;
    };

    const publish = async () => {
        if (!validateForm()) return;

        setIsPublishing(true);
        try {
            const results = [];
            if (resultContent.trim()) {
                results.push({ type: "text", content: resultContent });
            }
            resultImages.forEach((url) => {
                results.push({ type: "image", url });
            });

            const res = await fetch("/api/prompts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    description,
                    category,
                    aiTool: aiTools,
                    results,
                    published: true,
                }),
            });

            if (!res.ok) throw new Error("Failed to publish");
            const data = await res.json();
            setCreatedId(data.id);
            setShowSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            toast.error("Failed to publish prompt");
        } finally {
            setIsPublishing(false);
        }
    };

    // Success overlay
    if (showSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto"
            >
                <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-zinc-900" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900 mb-2 tracking-tight">
                    Prompt Published!
                </h2>
                <p className="text-[14px] text-zinc-500 mb-8 max-w-sm">
                    Your prompt is now live and available for the community to discover.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push(`/dashboard/prompt/${createdId}`)}
                        className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-[13px] font-medium hover:bg-zinc-800 transition-colors"
                    >
                        View Prompt
                    </button>
                    <button
                        onClick={() => {
                            setShowSuccess(false);
                            setTitle("");
                            setContent("");
                            setDescription("");
                            setCategory("");
                            setAiTools([]);
                            setResultContent("");
                            setResultImages([]);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-zinc-50 text-zinc-700 text-[13px] font-medium hover:bg-zinc-100 transition-colors"
                    >
                        Upload Another
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <div className="border-b border-zinc-100/80 pb-4 mb-8">
                <h1 className="text-[28px] font-normal tracking-tight text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.04em" }}>Share a Prompt</h1>
                <p className="text-[14px] text-zinc-500 mt-2">Add your AI formula to the community vault.</p>

                {/* Progress bar — Zeigarnik Effect */}
                {(() => {
                    const steps = [
                        { done: !!title.trim(), label: "Title" },
                        { done: !!content.trim(), label: "Prompt" },
                        { done: !!category, label: "Category" },
                        { done: aiTools.length > 0, label: "AI Tools" },
                        { done: !!resultContent.trim() || resultImages.length > 0, label: "Output" },
                    ];
                    const completed = steps.filter(s => s.done).length;
                    return (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[11px] font-medium text-zinc-400">
                                    {completed}/{steps.length} completed
                                </span>
                                <span className="text-[11px] font-medium text-zinc-400">
                                    {completed === steps.length ? "✓ Ready to publish" : `${steps.find(s => !s.done)?.label} next`}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {steps.map((step, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${step.done ? "bg-zinc-900" : "bg-zinc-100"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </div>

            <div className="space-y-10">
                {/* 1. Core Prompt */}
                <section className="space-y-5">
                    <h2 className="text-[15px] font-semibold text-zinc-900">1. The Prompt</h2>

                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Prompt Title (e.g. Next.js SaaS Architect)"
                            className="w-full bg-white border border-zinc-200/80 rounded-xl px-4 py-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your prompt formula here..."
                            className="w-full bg-zinc-50 border border-transparent rounded-xl px-4 py-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all font-mono min-h-[160px] resize-y"
                        />
                        <span className="absolute bottom-3 right-3 text-[11px] text-zinc-400 font-medium">
                            {content.length} chars
                        </span>
                    </div>

                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                            placeholder="Briefly describe what this prompt produces and how to use it..."
                            className="w-full bg-white border border-zinc-200/80 rounded-xl px-4 py-3 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 transition-all min-h-[80px] resize-y"
                        />
                    </div>
                </section>

                <div className="w-full h-px bg-zinc-100" />

                {/* 2. Metadata */}
                <section className="space-y-6">
                    <h2 className="text-[15px] font-semibold text-zinc-900">2. Categorization</h2>

                    {/* Category */}
                    <div>
                        <label className="text-[12px] text-zinc-500 font-medium mb-2 block">Primary Category</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => {
                                const Icon = categoryIcons[cat] || Sparkles;

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all active:scale-95 duration-200",
                                            category === cat
                                                ? "bg-zinc-900 text-white shadow-sm ring-2 ring-zinc-900 ring-offset-1"
                                                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5" strokeWidth={category === cat ? 2.5 : 2} />
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* AI Tools */}
                    <div>
                        <label className="text-[12px] text-zinc-500 font-medium mb-3 block">Target AI Tools</label>
                        <div className="flex flex-wrap gap-2.5">
                            {AI_TOOLS.map((tool) => {
                                const isSelected = aiTools.includes(tool);
                                return (
                                    <button
                                        key={tool}
                                        onClick={() => toggleAiTool(tool)}
                                        className={cn(
                                            "transition-all active:scale-95 duration-200",
                                            isSelected ? "opacity-100 ring-2 ring-zinc-900 ring-offset-1 rounded-md" : "opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                                        )}
                                        type="button"
                                    >
                                        <AiToolBadge tool={tool} className={cn("cursor-pointer border-transparent shadow-sm", !isSelected && "bg-zinc-100 text-zinc-600")} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="w-full h-px bg-zinc-100" />

                {/* 3. Output Example */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[15px] font-semibold text-zinc-900">3. Output Example</h2>
                        <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                            <button
                                onClick={() => setResultType("text")}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all",
                                    resultType === "text"
                                        ? "bg-white text-zinc-900 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                )}
                            >
                                <FileText className="w-3.5 h-3.5" /> Text
                            </button>
                            <button
                                onClick={() => setResultType("image")}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all",
                                    resultType === "image"
                                        ? "bg-white text-zinc-900 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-700"
                                )}
                            >
                                <ImageIcon className="w-3.5 h-3.5" /> Image
                            </button>
                        </div>
                    </div>

                    {resultType === "text" ? (
                        <textarea
                            value={resultContent}
                            onChange={(e) => setResultContent(e.target.value)}
                            placeholder="Paste an example of the output generated by this prompt..."
                            className="w-full bg-zinc-50 border border-transparent rounded-xl px-4 py-3 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 transition-all font-mono min-h-[120px] resize-y"
                        />
                    ) : (
                        <div className="space-y-4">
                            {resultImages.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {resultImages.map((url, i) => (
                                        <div key={i} className="relative group rounded-xl overflow-hidden border border-zinc-200 aspect-video bg-zinc-50">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt={`Result ${i + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(url)}
                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {resultImages.length < 5 && (
                                <div className="border border-zinc-200 bg-white rounded-xl p-6">
                                    <UploadDropzone
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            const urls = res.map(r => r.url);
                                            setResultImages(prev => [...prev, ...urls]);
                                            toast.success("Image uploaded successfully");
                                        }}
                                        onUploadError={(error: Error) => {
                                            toast.error(`Error: ${error.message}`);
                                        }}
                                        appearance={{
                                            container: "border-none outline-none py-4 px-0",
                                            label: "text-zinc-500 hover:text-zinc-700",
                                            button: "ut-ready:bg-zinc-900 ut-uploading:bg-zinc-400 after:bg-zinc-800",
                                            allowedContent: "text-zinc-400 text-xs",
                                            uploadIcon: "text-zinc-300 w-10 h-10 mb-2"
                                        }}
                                        content={{
                                            label: "Drag images here or click to browse",
                                        }}
                                    />

                                </div>
                            )}
                        </div>
                    )}
                </section>

                <div className="pt-6 border-t border-zinc-100">
                    <button
                        onClick={publish}
                        disabled={isPublishing}
                        className="w-full bg-black hover:bg-zinc-800 text-white rounded-full py-4 text-[15px] font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isPublishing ? (
                            <><Sparkles className="w-4 h-4 animate-spin" /> Publishing...</>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> Publish Prompt</>
                        )}
                    </button>
                    <p className="text-center text-[11px] text-zinc-400 mt-3 font-medium">
                        By publishing, you agree to share this prompt with the community.
                    </p>
                </div>
            </div >
        </div >
    );
}
