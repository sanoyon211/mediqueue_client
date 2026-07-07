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
      icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
      title: '100% Verified Tutors',
      desc: 'Every educator on our platform undergoes a strict background check and academic credential verification to ensure quality learning.',
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: 'Flexible Scheduling',
      desc: 'Prevent all scheduling conflicts. Set your preferred dates and book slots that align perfectly with your daily routine.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      title: 'Personalized Learning',
      desc: 'Get 1-on-1 private tuition customized precisely to your unique learning speed, curriculum, and academic goals.',
    },
    {
      icon: <Award className="w-6 h-6 text-blue-500" />,
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
    <div className="w-full bg-slate-50 dark:bg-slate-950/40 border-t border-slate-200 dark:border-white/[0.05] transition-colors duration-300">

      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
            Why Learn with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              MediQueue?
            </span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            We are dedicated to building a seamless, high-quality, and
            conflict-free online tutoring experience for students worldwide.
          </p>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 hover:shadow-lg dark:hover:shadow-none hover:border-blue-500/30 transition-all duration-300 flex flex-col items-start space-y-4 group"
            >
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 group-hover:scale-110 transition-transform duration-300 border border-blue-100 dark:border-blue-800/30">
                {feat.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>


      <section className="py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/[0.08] bg-slate-900 shadow-2xl p-8 sm:p-12 md:p-20">

          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {stat.num}
                </h4>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
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
