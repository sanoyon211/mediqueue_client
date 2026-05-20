'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  Star,
  DollarSign,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { motion } from 'framer-motion';

const getTutorImage = (photo, image) => {
  const url = photo || image;
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80';
  }
  const lower = url.toLowerCase().trim();

  if (
    lower.startsWith('http') &&
    (lower.endsWith('/') ||
      lower.endsWith('.com') ||
      lower.endsWith('.tv') ||
      lower.endsWith('.org') ||
      lower.endsWith('.net'))
  ) {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80';
  }
  return url;
};

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    document.title = 'Explore Tutors - MediQueue';
    fetchTutors();
  }, []);

  const fetchTutors = async (searchVal = '', start = '', end = '') => {
    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let url = `${apiUrl}/api/tutors?search=${encodeURIComponent(searchVal)}`;
      if (start) url += `&startDate=${start}`;
      if (end) url += `&endDate=${end}`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setTutors(data.data);
      } else {
        setTutors([]);
      }
    } catch (err) {
      console.error('Failed to fetch tutors', err);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    fetchTutors(search, startDate, endDate);
  };

  const handleReset = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    fetchTutors('', '', '');
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] py-12 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Learning Partner
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            Search through our database of highly qualified tutors and filter
            sessions by date.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          {/* Search Box */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
              Search by Tutor Name
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="Type name (e.g. Clara, John)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 transition-all text-zinc-800 dark:text-zinc-200 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
              Available From
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 transition-all text-zinc-800 dark:text-zinc-200 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-zinc-500 uppercase tracking-wider">
              Available To
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-violet-500 transition-all text-zinc-800 dark:text-zinc-200 font-medium"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-4 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-extrabold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 transition-all flex items-center gap-2"
            >
              <Search size={16} />
              <span>Search Tutors</span>
            </button>
          </div>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[280px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse p-6 space-y-5"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl mx-auto space-y-4">
            <div className="inline-flex p-3 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-500">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-xl font-bold">No Tutors Found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              We couldn't find any tutors matching your search criteria. Try
              resetting filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tutors.map(tutor => (
              <motion.div
                key={tutor._id}
                whileHover={{ y: -4 }}
                className="flex flex-col h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md hover:border-violet-500/30 transition-all duration-300"
              >
                <div className="p-6 flex-grow space-y-5">
                  <div className="flex gap-4 items-center">
                    <img
                      src={getTutorImage(tutor.photo, tutor.image)}
                      alt={tutor.tutorName || tutor.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/20"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100 line-clamp-1">
                        {tutor.tutorName || tutor.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {tutor.rating ? tutor.rating.toFixed(1) : '5.0'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                      {tutor.subject}
                    </span>
                    <span className="flex items-center text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                      <DollarSign size={16} className="text-emerald-500" />
                      <span className="text-base">
                        {tutor.hourlyFee || tutor.price}
                      </span>
                      /hr
                    </span>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {tutor.description}
                  </p>
                </div>

                <div className="p-6 pt-0 border-t border-zinc-100 dark:border-zinc-800 mt-auto flex items-center justify-between">
                  <div>
                    {tutor.totalSlot > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {tutor.totalSlot} slots left
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Booked Out
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/tutors/${tutor._id}`}
                    className="px-4 py-2 font-bold text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/10 hover:bg-violet-500 hover:text-white transition-all duration-300 rounded-lg"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
