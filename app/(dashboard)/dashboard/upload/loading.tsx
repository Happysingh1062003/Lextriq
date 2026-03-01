export default function UploadLoading() {
    return (
        <div className="space-y-8 max-w-2xl animate-pulse">
            {/* Header */}
            <div className="h-[30px] w-[200px] rounded-lg skeleton-shimmer bg-zinc-100" />
            <div className="h-[18px] w-[300px] rounded-md skeleton-shimmer bg-zinc-100" />

            {/* Form fields */}
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="h-[16px] w-[100px] rounded-md skeleton-shimmer bg-zinc-100" />
                    <div className="h-[44px] w-full rounded-xl skeleton-shimmer bg-zinc-100" />
                </div>
            ))}

            {/* Textarea */}
            <div className="space-y-2">
                <div className="h-[16px] w-[120px] rounded-md skeleton-shimmer bg-zinc-100" />
                <div className="h-[160px] w-full rounded-xl skeleton-shimmer bg-zinc-100" />
            </div>

            {/* Button */}
            <div className="h-[48px] w-[160px] rounded-full skeleton-shimmer bg-zinc-100" />
        </div>
    );
}
