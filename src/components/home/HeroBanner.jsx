'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const slides = [
  {
    id: 1,
    title: 'Unlock Your Potential with Personalized Tutoring',
    description:
      'Connect with certified, highly experienced tutors who cater directly to your unique learning style and academic goals.',
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    cta: 'Explore Tutors',
  },
  {
    id: 2,
    title: 'Master Complex Subjects Easily & Seamlessly',
    description:
      'From high school mathematics to advanced computer science and programming, find the perfect guide to help you excel.',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    cta: 'Browse Categories',
  },
  {
    id: 3,
    title: 'Learn from Anywhere, Anytime with No Conflicts',
    description:
      'Schedule online/offline sessions dynamically that fit perfectly into your busy life. Prevent time-slot conflicts with our advanced booking system.',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    cta: 'Book a Session',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full h-[550px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
        >

          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-transparent dark:from-zinc-950/95 dark:via-zinc-950/80 dark:to-transparent" />


          <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-center text-white z-10">
            <div className="max-w-2xl space-y-6">

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-xs font-semibold uppercase tracking-wider text-violet-300"
              >
                <BookOpen size={14} />
                <span>Premium Tutor Booking Platform</span>
              </motion.div>


              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]"
              >
                {slides[currentSlide].title}
              </motion.h1>


              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-zinc-300 font-medium leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>


              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-4"
              >
                <Link
                  href="/tutors"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                >
                  <span>{slides[currentSlide].cta}</span>
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>


      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/40 hover:bg-violet-600/70 text-white backdrop-blur-sm border border-white/10 hover:border-violet-500/50 transition-all z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/40 hover:bg-violet-600/70 text-white backdrop-blur-sm border border-white/10 hover:border-violet-500/50 transition-all z-20"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-violet-500 w-8'
                : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
