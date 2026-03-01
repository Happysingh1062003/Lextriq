import { SkeletonCard } from "@/components/SkeletonCard";

export default function DashboardLoading() {
    return (
        <div className="space-y-20 max-w-6xl animate-pulse">
            {/* Greeting skeleton */}
            <section className="space-y-6">
                <div className="h-[34px] w-[220px] rounded-lg skeleton-shimmer bg-zinc-100" />
                <div className="h-[60px] w-full max-w-md rounded-xl skeleton-shimmer bg-zinc-100" />
            </section>

            {/* Section skeletons */}
            {Array.from({ length: 4 }).map((_, s) => (
                <section key={s}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-[26px] w-[150px] rounded-lg skeleton-shimmer bg-zinc-100" />
                        <div className="h-[18px] w-[70px] rounded-md skeleton-shimmer bg-zinc-100" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </section>
            ))}
        </div>
    );
}
