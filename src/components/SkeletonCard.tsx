export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#263238]/10 p-6 shadow-sm animate-pulse">
      <div className="flex gap-4">
        {/* Avatar Skeleton */}
        <div className="w-12 h-12 bg-[#263238]/10 rounded-xl flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {/* Title Skeleton */}
          <div className="h-5 bg-[#263238]/10 rounded-lg w-3/4 mb-3" />
          
          {/* Company Skeleton */}
          <div className="h-4 bg-[#263238]/10 rounded-lg w-1/2 mb-4" />
          
          {/* Meta Info Skeleton */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="h-4 bg-[#263238]/10 rounded-lg w-24" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-20" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-20" />
          </div>
          
          {/* Description Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-[#263238]/10 rounded-lg w-full" />
            <div className="h-3 bg-[#263238]/10 rounded-lg w-5/6" />
          </div>
          
          {/* Buttons Skeleton */}
          <div className="flex gap-3">
            <div className="h-10 bg-[#263238]/10 rounded-xl flex-1" />
            <div className="h-10 bg-[#263238]/10 rounded-xl w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
