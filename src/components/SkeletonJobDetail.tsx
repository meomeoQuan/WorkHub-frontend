export function SkeletonJobDetail() {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button Skeleton */}
        <div className="h-6 bg-[#263238]/10 rounded-lg w-32 mb-8 animate-pulse" />
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-[#263238]/10 p-8 shadow-lg mb-6 animate-pulse">
          <div className="flex items-start gap-6 mb-6">
            {/* Company Logo Skeleton */}
            <div className="w-20 h-20 bg-[#263238]/10 rounded-2xl flex-shrink-0" />
            
            <div className="flex-1">
              {/* Title Skeleton */}
              <div className="h-7 bg-[#263238]/10 rounded-lg w-2/3 mb-3" />
              
              {/* Company Skeleton */}
              <div className="h-5 bg-[#263238]/10 rounded-lg w-1/3 mb-4" />
              
              {/* Meta Info Skeleton */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="h-4 bg-[#263238]/10 rounded-lg w-28" />
                <div className="h-4 bg-[#263238]/10 rounded-lg w-24" />
                <div className="h-4 bg-[#263238]/10 rounded-lg w-24" />
              </div>
            </div>
          </div>
          
          {/* Apply Button Skeleton */}
          <div className="h-12 bg-[#263238]/10 rounded-xl w-full" />
        </div>
        
        {/* Content Section */}
        <div className="bg-white rounded-2xl border border-[#263238]/10 p-8 shadow-lg animate-pulse">
          {/* Section Title */}
          <div className="h-6 bg-[#263238]/10 rounded-lg w-48 mb-4" />
          
          {/* Description Lines */}
          <div className="space-y-3 mb-8">
            <div className="h-4 bg-[#263238]/10 rounded-lg w-full" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-full" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-5/6" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-full" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-4/5" />
          </div>
          
          {/* Section Title */}
          <div className="h-6 bg-[#263238]/10 rounded-lg w-48 mb-4" />
          
          {/* List Items */}
          <div className="space-y-2 mb-8">
            <div className="h-4 bg-[#263238]/10 rounded-lg w-11/12" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-10/12" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-11/12" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-9/12" />
          </div>
          
          {/* Section Title */}
          <div className="h-6 bg-[#263238]/10 rounded-lg w-48 mb-4" />
          
          {/* List Items */}
          <div className="space-y-2">
            <div className="h-4 bg-[#263238]/10 rounded-lg w-10/12" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-11/12" />
            <div className="h-4 bg-[#263238]/10 rounded-lg w-9/12" />
          </div>
        </div>
      </div>
    </div>
  );
}
