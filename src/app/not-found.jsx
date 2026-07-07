'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-slate-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl text-center space-y-6 sm:space-y-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl p-5 sm:p-10 md:p-12 shadow-2xl relative z-10"
      >
        {/* Animated Icon Container */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="inline-flex p-5 rounded-3xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-lg shadow-red-500/5"
        >
          <ShieldAlert size={48} />
        </motion.div>

        {/* Heading */}
        <div className="space-y-3">
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white select-none tracking-tight"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white"
          >
            Page Not Found
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed"
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
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-sm text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
