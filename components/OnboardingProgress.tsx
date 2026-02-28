"use client";

import { useState, useEffect } from "react";
import { Check, Bookmark, Upload, X } from "lucide-react";
import Link from "next/link";

interface OnboardingProgressProps {
    hasSavedPrompt: boolean;
    hasUploadedPrompt: boolean;
}

export function OnboardingProgress({ hasSavedPrompt, hasUploadedPrompt }: OnboardingProgressProps) {
    const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

    useEffect(() => {
        const wasDismissed = localStorage.getItem("lextriq_onboarding_dismissed");
        if (!wasDismissed) setDismissed(false);
    }, []);

    if (dismissed) return null;

    const steps = [
        { label: "Create Account", done: true, icon: Check },
        { label: "Save a Prompt", done: hasSavedPrompt, icon: Bookmark, href: "/dashboard/discover" },
        { label: "Upload a Prompt", done: hasUploadedPrompt, icon: Upload, href: "/dashboard/upload" },
    ];

    const completedCount = steps.filter(s => s.done).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    // If all steps done, auto-dismiss
    if (completedCount === steps.length) {
        localStorage.setItem("lextriq_onboarding_dismissed", "true");
        return null;
    }

    const handleDismiss = () => {
        localStorage.setItem("lextriq_onboarding_dismissed", "true");
        setDismissed(true);
    };

    return (
        <div className="relative bg-white/80 backdrop-blur-sm border border-black/5 rounded-xl p-6 animate-fade-in">
            {/* Dismiss */}
            <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="Dismiss onboarding"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-4 pr-6">
                <div>
                    <h3 className="text-[15px] font-semibold text-zinc-900">Your vault is {progress}% ready</h3>
                    <p className="text-[12px] text-zinc-500 mt-0.5">Complete these steps to get the most out of Lextriq.</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-black/5 rounded-full mb-5 overflow-hidden">
                <div
                    className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Steps */}
            <div className="flex gap-3">
                {steps.map((step) => {
                    const StepIcon = step.icon;
                    const content = (
                        <div
                            key={step.label}
                            className={`flex-1 flex items-center gap-3 p-3 rounded-lg transition-colors ${step.done
                                    ? "bg-black/[0.03]"
                                    : "bg-black/[0.02] hover:bg-black/[0.05] cursor-pointer"
                                }`}
                        >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done
                                    ? "bg-black text-white"
                                    : "bg-black/5 text-zinc-400"
                                }`}>
                                {step.done ? (
                                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                                ) : (
                                    <StepIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                                )}
                            </div>
                            <span className={`text-[13px] font-medium ${step.done ? "text-zinc-400 line-through" : "text-zinc-700"
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    );

                    if (!step.done && step.href) {
                        return <Link key={step.label} href={step.href} className="flex-1">{content}</Link>;
                    }
                    return <div key={step.label} className="flex-1">{content}</div>;
                })}
            </div>
        </div>
    );
}
