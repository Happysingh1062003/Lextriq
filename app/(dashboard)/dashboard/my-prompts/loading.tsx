import { SkeletonCard } from "@/components/SkeletonCard";

export default function MyPromptsLoading() {
    return (
        <div className="space-y-8 max-w-6xl animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="h-[30px] w-[180px] rounded-lg skeleton-shimmer bg-zinc-100" />
                <div className="h-[40px] w-[140px] rounded-full skeleton-shimmer bg-zinc-100" />
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        </div>
    );
}
