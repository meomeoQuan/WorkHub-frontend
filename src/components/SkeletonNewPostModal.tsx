export function SkeletonNewPostModal() {
  return (
    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-pulse">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#263238]/10">
        <div className="h-5 bg-[#263238]/10 rounded-lg w-32" />
        <div className="w-9 h-9 bg-[#263238]/10 rounded-full" />
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* User Info */}
        <div className="flex gap-3 mb-4">
          <div className="w-12 h-12 bg-[#263238]/10 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-[#263238]/10 rounded-lg w-32 mb-2" />
            <div className="h-3 bg-[#263238]/10 rounded-lg w-24" />
          </div>
        </div>

        {/* Topic Input */}
        <div className="mb-4">
          <div className="h-3 bg-[#263238]/10 rounded-lg w-16 mb-2" />
          <div className="h-10 bg-[#263238]/10 rounded-xl w-full" />
        </div>

        {/* Post Content Input */}
        <div className="mb-4">
          <div className="h-3 bg-[#263238]/10 rounded-lg w-24 mb-2" />
          <div className="h-32 bg-[#263238]/10 rounded-xl w-full" />
        </div>

        {/* Attach Job Section */}
        <div className="mb-4">
          <div className="h-3 bg-[#263238]/10 rounded-lg w-32 mb-2" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((index) => (
              <div key={index} className="h-8 w-28 bg-[#263238]/10 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Character Count */}
        <div className="flex justify-end">
          <div className="h-3 bg-[#263238]/10 rounded-lg w-16" />
        </div>
      </div>

      {/* Modal Footer */}
      <div className="border-t border-[#263238]/10 p-4 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-9 h-9 bg-[#263238]/10 rounded-lg" />
          <div className="w-9 h-9 bg-[#263238]/10 rounded-lg" />
        </div>
        <div className="h-10 w-20 bg-[#263238]/10 rounded-xl" />
      </div>
    </div>
  );
}
