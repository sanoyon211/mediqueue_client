'use client';

import React from 'react';
import {
  ShieldCheck,
  Clock,
  Users,
  Award,
  Sparkles,
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExtraSections() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-violet-500" />,
      title: '100% Verified Tutors',
      desc: 'Every educator on our platform undergoes a strict background check and academic credential verification to ensure quality learning.',
    },
    {
      icon: <Clock className="w-8 h-8 text-violet-500" />,
      title: 'Flexible Scheduling',
      desc: 'Prevent all scheduling conflicts. Set your preferred dates and book slots that align perfectly with your daily routine.',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-violet-500" />,
      title: 'Personalized Learning',
      desc: 'Get 1-on-1 private tuition customized precisely to your unique learning speed, curriculum, and academic goals.',
    },
    {
      icon: <Award className="w-8 h-8 text-violet-500" />,
      title: 'Affordable Pricing',
      desc: 'Find elite tutors that fit within your budget. Transparent hourly rates with zero hidden platform charges.',
    },
  ];

  const stats = [
    { num: '15,000+', label: 'Active Students' },
    { num: '1,200+', label: 'Verified Tutors' },
    { num: '99.8%', label: 'Satisfaction Rate' },
    { num: '4.9/5.0', label: 'Average Rating' },
  ];

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-900 transition-colors duration-300">

      <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Why Learn with{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              MediQueue?
            </span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium">
            We are dedicated to building a seamless, high-quality, and
            conflict-free online tutoring experience for students worldwide.
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="p-5 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] dark:hover:shadow-none hover:border-violet-500/20 transition-all duration-500 flex flex-col items-center text-center space-y-4 group"
            >
              <div className="p-3.5 rounded-2xl bg-violet-100 dark:bg-violet-950/40 group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100">
                {feat.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>


      <section className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-100 dark:shadow-none p-6 sm:p-10 md:p-16">

          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12 relative z-10 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1.5">
                <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {stat.num}
                </h4>
                <p className="text-[10px] sm:text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
