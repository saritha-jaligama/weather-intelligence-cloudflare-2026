import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div id="loading-skeleton-container" className="space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-8 w-56 bg-slate-200 rounded" />
            <div className="h-4 w-40 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-100 rounded-xl self-start" />
        </div>

        <div className="py-6 flex items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200 rounded-2xl shrink-0" />
          <div className="space-y-3">
            <div className="h-12 w-36 bg-slate-200 rounded" />
            <div className="h-5 w-48 bg-slate-100 rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-5 border-t border-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-2">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-6 w-16 bg-slate-200 rounded" />
              <div className="h-2 w-full bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Chart Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="h-44 w-full bg-slate-100 rounded-xl" />
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="h-5 w-44 bg-slate-200 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
              <div className="h-4 w-12 bg-slate-200 rounded" />
              <div className="w-10 h-10 bg-slate-200 rounded-xl mx-auto" />
              <div className="h-4 w-14 bg-slate-200 rounded mx-auto" />
              <div className="h-1.5 w-full bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
