"use client";

interface LoadingSkeletonProps {
  variant?: "card" | "text" | "avatar" | "chart";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = "card",
  count = 1,
  className = "",
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <div className={`glass-card p-6 animate-pulse ${className}`}>
            <div className="h-4 w-1/4 rounded-full bg-slate-700 mb-4" />
            <div className="space-y-3">
              <div className="h-8 rounded-lg bg-slate-700" />
              <div className="h-4 rounded-lg bg-slate-700 w-3/4" />
            </div>
          </div>
        );
      case "text":
        return (
          <div className={`space-y-2 animate-pulse ${className}`}>
            <div className="h-4 rounded-lg bg-slate-700 w-full" />
            <div className="h-4 rounded-lg bg-slate-700 w-5/6" />
            <div className="h-4 rounded-lg bg-slate-700 w-4/6" />
          </div>
        );
      case "avatar":
        return (
          <div className={`flex items-center gap-3 animate-pulse ${className}`}>
            <div className="h-12 w-12 rounded-full bg-slate-700" />
            <div className="space-y-2 flex-1">
              <div className="h-4 rounded-lg bg-slate-700 w-3/4" />
              <div className="h-3 rounded-lg bg-slate-700 w-1/2" />
            </div>
          </div>
        );
      case "chart":
        return (
          <div className={`glass-card p-6 animate-pulse ${className}`}>
            <div className="h-4 w-1/4 rounded-full bg-slate-700 mb-6" />
            <div className="space-y-2">
              <div className="h-40 rounded-lg bg-slate-700" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={idx > 0 ? "mt-4" : ""}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}
