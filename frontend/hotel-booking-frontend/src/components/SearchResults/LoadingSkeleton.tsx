import React from "react";

interface LoadingSkeletonProps {
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 8 }) => (
  <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="h-72 rounded-2xl bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 animate-pulse"
      />
    ))}
  </div>
);

export default LoadingSkeleton;