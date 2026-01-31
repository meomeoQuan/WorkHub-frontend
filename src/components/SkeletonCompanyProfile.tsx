export function SkeletonCompanyProfile() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="h-5 bg-[#263238]/10 rounded-lg w-24 mb-6" />
        
        {/* Profile Header */}
        <div className="p-8 mb-6 bg-white rounded-2xl border border-[#263238]/10 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo Skeleton */}
            <div className="w-32 h-32 bg-[#263238]/10 rounded-lg flex-shrink-0" />
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="h-8 bg-[#263238]/10 rounded-lg w-48 mb-3" />
                  <div className="h-6 bg-[#263238]/10 rounded-lg w-32" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mt-4">
                <div className="h-5 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-5 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-5 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-5 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-5 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-5 bg-[#263238]/10 rounded-lg w-full" />
              </div>
              
              <div className="flex gap-3 mt-6">
                <div className="h-10 bg-[#263238]/10 rounded-xl w-32" />
                <div className="h-10 bg-[#263238]/10 rounded-xl w-40" />
                <div className="h-10 bg-[#263238]/10 rounded-xl w-32" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Company */}
            <div className="p-6 bg-white rounded-2xl border border-[#263238]/10 shadow-lg">
              <div className="h-6 bg-[#263238]/10 rounded-lg w-40 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-4 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-4 bg-[#263238]/10 rounded-lg w-5/6" />
                <div className="h-4 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-4 bg-[#263238]/10 rounded-lg w-4/5" />
              </div>
            </div>
            
            {/* Posted Jobs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-7 bg-[#263238]/10 rounded-lg w-48" />
                <div className="h-9 bg-[#263238]/10 rounded-xl w-32" />
              </div>
              <div className="space-y-4">
                {/* Job Card Skeletons */}
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#263238]/10 p-6 shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#263238]/10 rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-5 bg-[#263238]/10 rounded-lg w-3/4 mb-3" />
                        <div className="h-4 bg-[#263238]/10 rounded-lg w-1/2 mb-4" />
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="h-4 bg-[#263238]/10 rounded-lg w-24" />
                          <div className="h-4 bg-[#263238]/10 rounded-lg w-20" />
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="h-3 bg-[#263238]/10 rounded-lg w-full" />
                          <div className="h-3 bg-[#263238]/10 rounded-lg w-5/6" />
                        </div>
                        <div className="flex gap-3">
                          <div className="h-10 bg-[#263238]/10 rounded-xl flex-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Stats Skeleton */}
            <div className="p-6 bg-white rounded-2xl border border-[#263238]/10 shadow-lg">
              <div className="h-5 bg-[#263238]/10 rounded-lg w-3/4 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <div className="h-8 bg-[#263238]/10 rounded-lg w-16 mb-2" />
                    <div className="h-4 bg-[#263238]/10 rounded-lg w-32" />
                    {i < 4 && <div className="h-px bg-[#263238]/10 mt-4" />}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Industry Focus Skeleton */}
            <div className="p-6 bg-white rounded-2xl border border-[#263238]/10 shadow-lg">
              <div className="h-5 bg-[#263238]/10 rounded-lg w-32 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 bg-[#263238]/10 rounded-full w-24" />
                ))}
              </div>
            </div>
            
            {/* Company Culture Skeleton */}
            <div className="p-6 bg-white rounded-2xl border border-[#263238]/10 shadow-lg">
              <div className="h-5 bg-[#263238]/10 rounded-lg w-36 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-[#263238]/10 rounded-lg w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
