export default function SettingsLoading() {
    return (
        <div className="space-y-8 max-w-2xl animate-pulse">
            {/* Header */}
            <div className="h-[30px] w-[150px] rounded-lg skeleton-shimmer bg-zinc-100" />

            {/* Avatar + name */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full skeleton-shimmer bg-zinc-100" />
                <div className="space-y-2">
                    <div className="h-[20px] w-[180px] rounded-md skeleton-shimmer bg-zinc-100" />
                    <div className="h-[16px] w-[220px] rounded-md skeleton-shimmer bg-zinc-100" />
                </div>
            </div>

            {/* Form fields */}
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="h-[16px] w-[80px] rounded-md skeleton-shimmer bg-zinc-100" />
                    <div className="h-[44px] w-full rounded-xl skeleton-shimmer bg-zinc-100" />
                </div>
            ))}

            {/* Button */}
            <div className="h-[44px] w-[120px] rounded-full skeleton-shimmer bg-zinc-100" />
        </div>
    );
}
