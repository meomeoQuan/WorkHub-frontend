export function SkeletonCommentModal() {
  return (
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-pulse">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#263238]/10">
        <div className="h-5 bg-[#263238]/10 rounded-lg w-40" />
        <div className="w-9 h-9 bg-[#263238]/10 rounded-full" />
      </div>

      {/* Modal Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Post Content */}
        <div className="p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-[#263238]/10 rounded-full flex-shrink-0" />
            
            <div className="flex-1">
              {/* Company Name and Rating */}
              <div className="flex items-center gap-2 mb-1">
                <div className="h-4 bg-[#263238]/10 rounded-lg w-32" />
                <div className="h-5 bg-[#FF9800]/10 rounded-lg w-12" />
                <div className="h-3 bg-[#263238]/10 rounded-lg w-8" />
              </div>
              
              {/* Username */}
              <div className="h-3 bg-[#263238]/10 rounded-lg w-24 mb-3" />
              
              {/* Post Content */}
              <div className="space-y-2 mb-4">
                <div className="h-3.5 bg-[#263238]/10 rounded-lg w-full" />
                <div className="h-3.5 bg-[#263238]/10 rounded-lg w-4/5" />
              </div>
            </div>
          </div>

          {/* Post Image - Much Larger */}
          <div className="mt-4 rounded-xl overflow-hidden bg-[#263238]/10" style={{ height: "560px" }} />
        </div>
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div className="border-t border-[#263238]/10 p-4 bg-white">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-[#263238]/10 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <div className="h-10 bg-[#263238]/10 rounded-full w-full mb-3" />
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-[#263238]/10 rounded-lg" />
              <div className="w-9 h-9 bg-[#263238]/10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
