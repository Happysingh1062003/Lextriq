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

    return (
        <div className="min-h-screen bg-[#F6F6F6]" suppressHydrationWarning>

            {/* Desktop sidebar — only render after mounted to prevent flash */}
            {mounted && !isMobile && (
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            )}

            {/* Mobile sidebar overlay + slide-in drawer */}
            {mounted && isMobile && (
                <>
                    <div
                        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setMobileOpen(false)}
                    />
                    <div
                        className="z-50 fixed inset-y-0 left-0 w-[280px] max-w-[80vw] transition-transform duration-300 ease-out"
                        style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
                    >
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

            {/* Main content — use CSS class before mount, JS margin after */}
            <main
                className={`pt-16 transition-all duration-300 ${!mounted ? 'md:ml-[280px]' : ''}`}
                suppressHydrationWarning
                style={mounted ? { marginLeft: isMobile ? 0 : sidebarWidth } : undefined}
            >
                <div className="p-4 md:p-8 lg:p-10">{children}</div>
            </main>
        </div>
    );
}
