export default function PromptDetailLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            {/* Back button */}
            <div className="h-[18px] w-[80px] rounded-md skeleton-shimmer bg-zinc-100" />

            {/* Title */}
            <div className="space-y-3">
                <div className="h-[36px] w-[80%] rounded-lg skeleton-shimmer bg-zinc-100" />
                <div className="h-[36px] w-[50%] rounded-lg skeleton-shimmer bg-zinc-100" />
            </div>

            {/* Author + meta row */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full skeleton-shimmer bg-zinc-100" />
                <div className="space-y-1.5">
                    <div className="h-[16px] w-[120px] rounded-md skeleton-shimmer bg-zinc-100" />
                    <div className="h-[14px] w-[180px] rounded-md skeleton-shimmer bg-zinc-100" />
                </div>
            </div>

            {/* Badge row */}
            <div className="flex gap-2">
                <div className="h-[28px] w-[80px] rounded-md skeleton-shimmer bg-zinc-100" />
                <div className="h-[28px] w-[100px] rounded-md skeleton-shimmer bg-zinc-100" />
                <div className="h-[28px] w-[70px] rounded-md skeleton-shimmer bg-zinc-100" />
            </div>

            {/* Content block */}
            <div className="space-y-3 py-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-[16px] rounded-md skeleton-shimmer bg-zinc-100" style={{ width: `${90 - i * 5}%` }} />
                ))}
            </div>

            {/* Action bar */}
            <div className="flex gap-4 pt-4 border-t border-zinc-100">
                <div className="h-[40px] w-[100px] rounded-full skeleton-shimmer bg-zinc-100" />
                <div className="h-[40px] w-[100px] rounded-full skeleton-shimmer bg-zinc-100" />
                <div className="h-[40px] w-[100px] rounded-full skeleton-shimmer bg-zinc-100" />
            </div>
        </div>
    );
}
