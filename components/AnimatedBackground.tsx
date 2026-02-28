// Server Component — no interactivity needed

export function AnimatedBackground({ intensity = "full" }: { intensity?: "full" | "subtle" }) {
    const opacity = intensity === "full" ? 0.06 : 0.03;

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Top-left warm gradient */}
            <div
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
                    top: "-300px",
                    left: "-300px",
                    opacity,
                }}
            />
            {/* Bottom-right cool gradient */}
            <div
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
                    bottom: "-300px",
                    right: "-300px",
                    opacity,
                }}
            />
        </div>
    );
}
