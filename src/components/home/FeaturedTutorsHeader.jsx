import React from 'react';

export default function FeaturedTutorsHeader() {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-4">
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
        Find & Book Our{' '}
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Featured Tutors
        </span>
      </h2>
      <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium">
        Learn from the absolute best. Browse our top-rated, certified educators
        available to schedule online and offline sessions immediately.
      </p>
    </div>
  );
}
