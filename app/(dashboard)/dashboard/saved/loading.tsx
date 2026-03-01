import { SkeletonCard } from "@/components/SkeletonCard";

export default function SavedLoading() {
    return (
        <div className="space-y-8 max-w-6xl animate-pulse">
            {/* Header skeleton */}
            <div className="h-[30px] w-[200px] rounded-lg skeleton-shimmer bg-zinc-100" />

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        </div>
    );
}
