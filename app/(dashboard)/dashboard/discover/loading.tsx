import { SkeletonCard } from "@/components/SkeletonCard";

export default function DiscoverLoading() {
    return (
        <div className="space-y-8 max-w-6xl animate-pulse">
            {/* Search bar skeleton */}
            <div className="h-[48px] w-full rounded-xl skeleton-shimmer bg-zinc-100" />

            {/* Filter bar skeleton */}
            <div className="flex gap-3 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-[36px] w-[90px] rounded-full skeleton-shimmer bg-zinc-100" />
                ))}
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        </div>
    );
}
