'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl text-center space-y-6 sm:space-y-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-5 sm:p-10 md:p-12 shadow-2xl relative z-10"
      >
        {/* Animated Icon Container */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="inline-flex p-5 rounded-3xl bg-red-100 dark:bg-red-950/40 text-red-500 shadow-lg shadow-red-500/5"
        >
          <ShieldAlert size={48} />
        </motion.div>

        {/* Heading */}
        <div className="space-y-3">
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent select-none tracking-tight"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-extrabold text-zinc-955 dark:text-zinc-50"
          >
            Page Not Found
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-semibold max-w-md mx-auto leading-relaxed"
          >
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-300 flex items-center justify-center gap-2 font-bold text-sm text-zinc-700 dark:text-zinc-200 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
