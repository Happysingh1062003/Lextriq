// Server Component — pure CSS skeleton animation

export function SkeletonCard() {
    return (
        <div className="bg-[#F4F4F5]/60 border border-black/[0.02] rounded-xl p-6 md:p-8 h-full min-h-[340px] flex flex-col shadow-sm" aria-hidden="true">
            {/* Row 1: Badge */}
            <div className="mb-6">
                <div className="h-[28px] w-[80px] rounded-md skeleton-shimmer bg-white/60" />
            </div>

            {/* Row 2: Title */}
            <div className="space-y-3 mb-6">
                <div className="h-[24px] w-[90%] rounded-md skeleton-shimmer bg-white/60" />
                <div className="h-[24px] w-[60%] rounded-md skeleton-shimmer bg-white/60" />
            </div>

            {/* Row 3: Description Peek */}
            <div className="flex-1 mt-2 space-y-2">
                <div className="h-[14px] w-full rounded-md skeleton-shimmer bg-white/40" />
                <div className="h-[14px] w-[95%] rounded-md skeleton-shimmer bg-white/40" />
                <div className="h-[14px] w-[85%] rounded-md skeleton-shimmer bg-white/40" />
                <div className="h-[14px] w-[90%] rounded-md skeleton-shimmer bg-white/40" />
            </div>

            {/* Row 4: Footer */}
            <div className="pt-5 mt-4 border-t border-black/5 flex justify-end">
                <div className="h-[20px] w-[100px] rounded-md skeleton-shimmer bg-white/60" />
            </div>
        </div>
    );
}
