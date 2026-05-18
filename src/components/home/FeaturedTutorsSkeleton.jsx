import React from 'react';

export default function FeaturedTutorsSkeleton() {

  const skeletonCards = [
    { className: 'flex' },
    { className: 'flex' },
    { className: 'hidden md:flex' },
    { className: 'hidden md:flex' },
    { className: 'hidden lg:flex' },
    { className: 'hidden lg:flex' },
  ];

  return (

    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skeletonCards.map((card, index) => (
          <div
            key={index}
            className={`${card.className} flex-col h-[280px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden p-6 space-y-5 animate-pulse`}
          >
            {/* Top Section */}
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
              </div>
            </div>

            {/* Badges line */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/5" />
            </div>

            {/* Description block */}
            <div className="space-y-2 flex-grow">
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
            </div>

            {/* Bottom line */}
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
              <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
