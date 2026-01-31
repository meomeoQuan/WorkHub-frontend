export function SkeletonCompanyStats() {
  return (
    <div className="p-6 bg-white rounded-2xl border border-[#263238]/10 shadow-lg animate-pulse">
      <div className="h-5 bg-[#263238]/10 rounded-lg w-3/4 mb-4" />
      
      <div className="space-y-4">
        {/* Stat Item 1 */}
        <div>
          <div className="h-8 bg-[#263238]/10 rounded-lg w-16 mb-2" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-32" />
        </div>
        
        <div className="h-px bg-[#263238]/10" />
        
        {/* Stat Item 2 */}
        <div>
          <div className="h-8 bg-[#263238]/10 rounded-lg w-12 mb-2" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-24" />
        </div>
        
        <div className="h-px bg-[#263238]/10" />
        
        {/* Stat Item 3 */}
        <div>
          <div className="h-8 bg-[#263238]/10 rounded-lg w-16 mb-2" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-40" />
        </div>
        
        <div className="h-px bg-[#263238]/10" />
        
        {/* Stat Item 4 */}
        <div>
          <div className="h-8 bg-[#263238]/10 rounded-lg w-12 mb-2" />
          <div className="h-4 bg-[#263238]/10 rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
}
