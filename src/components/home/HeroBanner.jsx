'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 pt-20">
      {/* Abstract Glowing Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center space-y-8">
        
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm"
        >
          <Sparkles size={14} className="text-blue-500" />
          <span>The New Standard in Online Tutoring</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] md:leading-[1.05]"
        >
          <span className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
            Unlock your potential with 
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            world-class educators
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Connect with certified, highly experienced tutors. Master complex subjects seamlessly with our conflict-free scheduling and personalized learning platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 pt-4"
        >
          <Link
            href="/tutors"
            className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] hover:-translate-y-0.5"
          >
            <span>Explore Tutors</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-xl font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm"
          >
            <span>Become a Student</span>
          </Link>
        </motion.div>

        {/* Social Proof / Stats */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.7, delay: 0.6 }}
           className="pt-16 md:pt-24 flex items-center justify-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">15k+</span>
            <span>Active Students</span>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">4.9/5</span>
            <span>Average Rating</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
