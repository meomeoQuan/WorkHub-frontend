export function SkeletonFeedPost() {
  return (
    <div className="bg-white border-b border-[#263238]/10 p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar Skeleton */}
          <div className="w-12 h-12 bg-[#263238]/10 rounded-full flex-shrink-0" />
          
          <div className="flex-1">
            {/* Company Name Skeleton */}
            <div className="h-4 bg-[#263238]/10 rounded-lg w-32 mb-2" />
            {/* Username and Time Skeleton */}
            <div className="h-3 bg-[#263238]/10 rounded-lg w-24" />
          </div>
        </div>
        
        {/* Follow Button Skeleton */}
        <div className="h-9 w-24 bg-[#263238]/10 rounded-xl" />
      </div>

      {/* Post Content Skeleton */}
      <div className="mb-4 space-y-2">
        <div className="h-3 bg-[#263238]/10 rounded-lg w-full" />
        <div className="h-3 bg-[#263238]/10 rounded-lg w-3/4" />
      </div>

      {/* Job Card Skeleton */}
      <div className="border-2 border-[#FF9800]/20 rounded-2xl p-4 mb-4 bg-gradient-to-br from-[#FF9800]/5 to-white">
        {/* Job Title Skeleton */}
        <div className="h-5 bg-[#263238]/10 rounded-lg w-2/3 mb-3" />
        
        {/* Job Meta Info Skeleton */}
        <div className="flex flex-wrap gap-3 mb-3">
          <div className="h-4 bg-[#263238]/10 rounded-lg w-28" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-24" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-20" />
        </div>
        
        {/* Badges Skeleton */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-20 bg-[#263238]/10 rounded-full" />
        </div>

        {/* View Details Button Skeleton */}
        <div className="h-8 bg-[#263238]/10 rounded-lg w-28" />
      </div>

      {/* Engagement Stats Skeleton */}
      <div className="flex items-center justify-between pt-3">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#263238]/10 rounded" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-8" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#263238]/10 rounded" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-8" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#263238]/10 rounded" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-8" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#263238]/10 rounded" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-6" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFeedPostGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="divide-y divide-[#263238]/10">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonFeedPost key={index} />
      ))}
    </div>
  );
}
