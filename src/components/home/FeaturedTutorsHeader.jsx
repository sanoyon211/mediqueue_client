import React from 'react';

export default function FeaturedTutorsHeader() {
  return (
    <div className="text-center max-w-2xl mx-auto mb-8 mt-10 md:mt-20 space-y-4">
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        Find & Book Our{' '}
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Featured Tutors
        </span>
      </h2>
      <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium">
        Learn from the absolute best. Browse our top-rated, certified educators
        available to schedule online and offline sessions immediately.
      </p>
    </div>
  );
}
