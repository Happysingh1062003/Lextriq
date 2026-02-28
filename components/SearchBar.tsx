"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Command } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit?: () => void;
    placeholder?: string;
}

export function SearchBar({
    value,
    onChange,
    onSubmit,
    placeholder = "Search prompts...",
}: SearchBarProps) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div
            className="relative transition-all duration-200"
            style={{ width: focused ? 400 : 320 }}
        >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && onSubmit) {
                        e.preventDefault();
                        onSubmit();
                    }
                }}
                placeholder={placeholder}
                className="w-full bg-zinc-50/50 border border-zinc-200/80 rounded-full pl-10 pr-16 py-2 text-[13.5px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 focus:bg-white focus:ring-4 focus:ring-zinc-100 transition-all shadow-sm"
            />
            {!focused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                </div>
            )}
        </div>
    );
}
