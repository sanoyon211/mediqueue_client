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
  const [currentPage, setCurrentPage] = useState(1);

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
        setCurrentPage(1);
      } else {
        setTutors([]);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Failed to fetch tutors', err);
      setTutors([]);
      setCurrentPage(1);
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

  const itemsPerPage = 9;
  const totalPages = Math.ceil(tutors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTutors = tutors.slice(startIndex, endIndex);

  return (
    <div className="min-h-[calc(100vh-16rem)] py-8 md:py-12 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Learning Partner
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium">
            Search through our database of highly qualified tutors and filter
            sessions by date.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          {/* Search Box */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Search by Tutor Name
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Type name (e.g. Clara, John)..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 dark:text-white font-medium cursor-text"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available From
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available To
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-4 flex flex-col sm:flex-row justify-end gap-3 pt-2 w-full">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
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
                className="h-[280px] rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 animate-pulse p-6 space-y-5"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto space-y-4">
            <div className="inline-flex p-3 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-500">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Tutors Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              We couldn't find any tutors matching your search criteria. Try
              resetting filters.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentTutors.map(tutor => (
                <motion.div
                  key={tutor._id}
                  whileHover={{ y: -4 }}
                  className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-500/30 transition-all duration-300 group"
                >
                  <div className="p-6 flex-grow space-y-5">
                    <div className="flex gap-4 items-center">
                      <img
                        src={getTutorImage(tutor.photo, tutor.image)}
                        alt={tutor.tutorName || tutor.name}
                        className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-colors"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-500 transition-colors">
                          {tutor.tutorName || tutor.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            {tutor.rating ? tutor.rating.toFixed(1) : '5.0'} / 5.0
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tutor.subject}
                      </span>
                      <span className="flex items-center text-sm font-bold text-slate-900 dark:text-white">
                        <DollarSign size={16} className="text-blue-500 mr-0.5" />
                        <span className="text-base">
                          {tutor.hourlyFee || tutor.price}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium ml-1">/hr</span>
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {tutor.description}
                    </p>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/[0.05] mt-auto flex items-center justify-between">
                    <div>
                      {tutor.totalSlot > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {tutor.totalSlot} slots left
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Booked Out
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/tutors/${tutor._id}`}
                      className="px-4 py-2 font-semibold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all duration-300 rounded-lg group-hover:bg-blue-600 group-hover:text-white"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-6 border-t border-slate-200 dark:border-white/[0.05]">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  Previous
                </button>
                <span className="text-sm font-semibold text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
