import { Zap } from 'lucide-react';

export function LoadingPage() {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <Zap className="w-10 h-10 text-white" />
          </div>
          {/* Spinning Ring */}
          <div className="absolute inset-0 border-4 border-[#4FC3F7] border-t-transparent rounded-2xl animate-spin" />
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <h3 className="text-xl text-[#263238] font-semibold mb-1">Loading...</h3>
          <p className="text-sm text-[#263238]/60">Please wait</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-48 h-1 bg-[#263238]/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FF9800] via-[#4FC3F7] to-[#4ADE80] animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
