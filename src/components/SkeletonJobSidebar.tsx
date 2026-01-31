export function SkeletonJobSidebar() {
  return (
    <div className="p-6 bg-white rounded-2xl border-2 border-[#263238]/10 shadow-xl animate-pulse">
      {/* Quick Apply Button Skeleton */}
      <div className="h-14 bg-[#263238]/10 rounded-xl w-full mb-3" />
      
      {/* Save Button Skeleton */}
      <div className="h-12 bg-[#263238]/10 rounded-xl w-full mb-6" />
      
      {/* Separator */}
      <div className="h-px bg-[#263238]/10 my-6" />
      
      {/* Company Info Section */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-[#263238]/10 rounded-lg" />
          <div className="h-5 bg-[#263238]/10 rounded-lg w-32" />
        </div>
        
        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-[#263238]/10 rounded-lg w-full" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-5/6" />
        </div>
        
        {/* Info Box */}
        <div className="space-y-3 p-4 bg-white rounded-xl border border-[#263238]/10">
          <div className="h-4 bg-[#263238]/10 rounded-lg w-3/4" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-2/3" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-1/2" />
        </div>
        
        {/* Link */}
        <div className="h-4 bg-[#263238]/10 rounded-lg w-40 mt-4" />
      </div>
      
      {/* Separator */}
      <div className="h-px bg-[#263238]/10 my-6" />
      
      {/* Quick Stats */}
      <div className="p-4 bg-gradient-to-br from-[#FF9800]/10 to-[#4FC3F7]/10 rounded-xl">
        <div className="h-3 bg-[#263238]/10 rounded-lg w-32 mb-2" />
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#263238]/10 rounded-full h-2" />
          <div className="h-3 bg-[#263238]/10 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}
