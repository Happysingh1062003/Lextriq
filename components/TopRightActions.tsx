"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserAvatar } from "@/components/UserAvatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";



export function TopRightActions({ sidebarCollapsed, isMobile, onMobileMenuToggle }: { sidebarCollapsed: boolean; isMobile?: boolean; onMobileMenuToggle?: () => void }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            className="fixed top-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 h-16 bg-[#F6F6F6]"
            style={{
                left: isMobile ? 0 : (sidebarCollapsed ? 72 : 280),
                transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
        >
            {/* Left side: hamburger (mobile) or page title (desktop) */}
            <div className="flex items-center gap-3">
                {/* Mobile: hamburger on far left */}
                {isMobile && onMobileMenuToggle && (
                    <button
                        onClick={onMobileMenuToggle}
                        className="p-2 -ml-2 rounded-lg text-black hover:text-black/80 hover:bg-black/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}

                {isMobile && (
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="Lextriq" width={26} height={26} />
                        <span className="text-[17px] font-normal tracking-tight text-[#1A1A1A]" style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.03em" }}>
                            Lextriq
                        </span>
                    </Link>
                )}
            </div>
            {/* Avatar Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2"
                    >
                        <UserAvatar
                            name={session?.user?.name}
                            image={session?.user?.image}
                            className="w-full h-full"
                        />
                    </motion.button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={10}
                    className="bg-white rounded-2xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] border border-zinc-100 w-56 p-1.5"
                >
                    {/* User info header */}
                    <div className="flex items-center gap-3 px-3 py-3 mb-1">
                        <UserAvatar
                            name={session?.user?.name}
                            image={session?.user?.image}
                            className="w-10 h-10"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-zinc-900 truncate">
                                {session?.user?.name}
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-100 mx-1.5 mb-1" />

                    {/* Settings */}
                    <DropdownMenuItem asChild className="focus:bg-zinc-50 rounded-xl cursor-pointer p-0">
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-zinc-600 font-medium">
                            <Settings className="w-4 h-4 text-zinc-400" strokeWidth={2} />
                            Settings
                        </Link>
                    </DropdownMenuItem>

                    <div className="h-px bg-zinc-100 mx-1.5 my-1" />

                    {/* Sign Out */}
                    <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="focus:bg-red-50 rounded-xl cursor-pointer flex items-center gap-3 px-3 py-2.5 text-[13px] text-zinc-600 hover:text-red-600 font-medium"
                    >
                        <LogOut className="w-4 h-4 text-zinc-400" strokeWidth={2} />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
