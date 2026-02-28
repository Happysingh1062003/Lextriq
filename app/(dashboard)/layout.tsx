"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopRightActions } from "@/components/TopRightActions";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    // Track screen size
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        setMounted(true);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Close mobile sidebar on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const sidebarWidth = sidebarCollapsed ? 72 : 280;
    const showDesktopSidebar = !mounted || !isMobile; // before mount, assume desktop
    const contentMargin = showDesktopSidebar ? sidebarWidth : 0;

    return (
        <div className="min-h-screen bg-[#F6F6F6]" suppressHydrationWarning>

            {/* Desktop sidebar — always visible on large screens */}
            {showDesktopSidebar && (
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            )}

            {/* Mobile sidebar overlay */}
            {mounted && isMobile && mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="z-50 fixed inset-y-0 left-0 w-[280px] max-w-[80vw]">
                        <Sidebar
                            collapsed={false}
                            onToggle={() => setMobileOpen(false)}
                        />
                    </div>
                </>
            )}

            {/* Top bar */}
            <TopRightActions
                sidebarCollapsed={sidebarCollapsed}
                isMobile={mounted ? isMobile : false}
                onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
            />

            {/* Main content */}
            <main
                className="pt-16 transition-all duration-300"
                suppressHydrationWarning
                style={{ marginLeft: contentMargin }}
            >
                <div className="p-4 md:p-8 lg:p-10">{children}</div>
            </main>
        </div>
    );
}
