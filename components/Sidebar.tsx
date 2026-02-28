"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Search,
    Bookmark,
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    History,
    Code,
    Palette,
    Bug,
    Rocket,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Discover", href: "/dashboard/discover", icon: Search },
    { label: "My Prompts", href: "/dashboard/my-prompts", icon: History },
    { label: "Saved", href: "/dashboard/saved", icon: Bookmark },
    { label: "Upload", href: "/dashboard/upload", icon: PlusCircle },
];

const categoryItems = [
    { label: "Coding", href: "/dashboard/discover?category=Coding", icon: Code, color: "text-blue-500" },
    { label: "Developing", href: "/dashboard/discover?category=Developing", icon: Rocket, color: "text-emerald-500" },
    { label: "UI/UX", href: "/dashboard/discover?category=UI/UX", icon: Palette, color: "text-purple-500" },
    { label: "Creatives", href: "/dashboard/discover?category=Creatives", icon: Sparkles, color: "text-rose-500" },
];

export function Sidebar({
    collapsed,
    onToggle,
}: {
    collapsed: boolean;
    onToggle: () => void;
}) {
    const pathname = usePathname();

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 72 : 280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "fixed left-0 top-0 h-full bg-[#F6F6F6] z-50 flex flex-col max-w-[80vw] overflow-hidden",
                !collapsed && "border-r border-black/[0.03]"
            )}
        >
            {/* Logo + Toggle */}
            <div className="h-16 flex items-center justify-between px-5 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!collapsed ? (
                        <motion.div
                            key="full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Image src="/logo.svg" alt="Lextriq" width={30} height={30} className="flex-shrink-0" />
                            <span className="text-[24px] font-normal tracking-tight text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.04em" }}>
                                Lextriq
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mx-auto"
                        >
                            <Image src="/logo.svg" alt="Lextriq" width={30} height={30} />
                        </motion.div>
                    )}
                </AnimatePresence>
                {!collapsed && (
                    <button
                        onClick={onToggle}
                        className="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-zinc-500 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}
                {collapsed && (
                    <button
                        onClick={onToggle}
                        className="absolute top-5 left-1/2 -translate-x-1/2 mt-12 w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-zinc-500 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 pt-8 overflow-y-auto overflow-x-hidden pb-4 space-y-6">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href));

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "relative flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 text-[14.5px] group",
                                        collapsed && "justify-center px-0",
                                        isActive
                                            ? "text-zinc-900 font-semibold"
                                            : "text-zinc-500 hover:text-zinc-900 hover:bg-black/5 font-medium"
                                    )}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="absolute inset-0 bg-black/5 rounded-xl"
                                            style={{ zIndex: -1 }}
                                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        />
                                    )}
                                    <Icon
                                        className={cn(
                                            "w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200",
                                            isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"
                                        )}
                                        strokeWidth={1.5}
                                    />
                                    {!collapsed && <span>{item.label}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Categories */}
                <div>
                    {!collapsed && (
                        <div className="px-3 mb-3 text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
                            Categories
                        </div>
                    )}
                    <div className="space-y-1">
                        {categoryItems.map((cat) => {
                            const CatIcon = cat.icon;
                            return (
                                <Link key={cat.label} href={cat.href}>
                                    <div
                                        className={cn(
                                            "flex items-center gap-4 px-3 py-1.5 rounded-xl transition-all duration-300 text-[14.5px] group hover:bg-black/5",
                                            collapsed && "justify-center px-0"
                                        )}
                                    >
                                        <CatIcon className={cn("w-[18px] h-[18px] flex-shrink-0", cat.color)} strokeWidth={1.5} />
                                        {!collapsed && <span className="text-zinc-500 group-hover:text-zinc-900 font-medium transition-colors duration-300">{cat.label}</span>}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </motion.aside>
    );
}
