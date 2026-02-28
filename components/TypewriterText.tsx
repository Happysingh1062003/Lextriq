"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
    prompts: string[];
}

export function TypewriterText({ prompts }: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [promptIndex, setPromptIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const currentPrompt = prompts[promptIndex];
        const speed = isDeleting ? 30 : 55;

        const timer = setTimeout(() => {
            if (!isDeleting) {
                if (displayedText.length < currentPrompt.length) {
                    setDisplayedText(currentPrompt.slice(0, displayedText.length + 1));
                } else {
                    setIsPaused(true);
                    setTimeout(() => {
                        setIsPaused(false);
                        setIsDeleting(true);
                    }, 1800);
                }
            } else {
                if (displayedText.length > 0) {
                    setDisplayedText(currentPrompt.slice(0, displayedText.length - 1));
                } else {
                    setIsDeleting(false);
                    setPromptIndex((prev) => (prev + 1) % prompts.length);
                }
            }
        }, speed);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, isPaused, promptIndex, prompts]);

    return (
        <div className="h-12 flex items-center justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-50/80 border border-zinc-100">
                <span className="text-zinc-300 text-sm font-mono">&gt;</span>
                <p className="text-zinc-500 text-sm font-mono">
                    {displayedText}
                    <span className="inline-block w-[2px] h-4 bg-violet-400 ml-0.5 align-middle animate-pulse" />
                </p>
            </div>
        </div>
    );
}
