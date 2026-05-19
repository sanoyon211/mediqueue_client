'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  User,
  Mail,
  DollarSign,
  Calendar,
  BookOpen,
  Clock,
  Globe,
} from 'lucide-react';

export default function AddTutor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const { data: session, isPending } = authClient.useSession();


  useEffect(() => {
    if (!isPending && !session) {
      toast.error('Please login to access this page!');
      router.push('/login');
    }
  }, [session, isPending, router]);


  const [subject, setSubject] = useState('Mathematics');
  const [price, setPrice] = useState('');
  const [language, setLanguage] = useState('English');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [totalSlot, setTotalSlot] = useState('');
  const [startDate, setStartDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');


  useEffect(() => {
    if (session?.user?.image) {
      setPhotoUrl(session.user.image);
    }
  }, [session]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!session) {
      return toast.error('Session expired. Please login again!');
    }

    if (!price || !description || !experience || !totalSlot || !startDate) {
      return toast.error('Please fill in all fields!');
    }

    const tutorData = {
      name: session.user.name, 
      email: session.user.email, 
      image: photoUrl || session.user.image,
      subject,
      price: Number(price),
      language,
      description,
      experience: Number(experience),
      totalSlot: Number(totalSlot),
      startDate,
      rating: 5.0, 
      reviewCount: 0, 
    };

    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/tutors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tutorData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Tutor slot registered successfully!');
        router.push('/my-tutors');
      } else {
        toast.error(data.message || 'Failed to add tutor slot.');
      }
    } catch (err) {
      toast.error('Failed to connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500 animate-spin border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] py-12 px-6 relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-8 md:p-10 shadow-xl relative z-10"
      >
        <div className="flex items-center gap-4 border-b border-zinc-200/80 dark:border-zinc-800 pb-6 mb-8">
          <div className="p-3 rounded-2xl bg-violet-100 dark:bg-violet-950/40 text-violet-500">
            <PlusCircle size={28} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
              Register as a Tutor
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold mt-1">
              Add your teaching subjects, pricing, and available calendar slots.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Your Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  value={session.user.name}
                  disabled
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 text-zinc-400 cursor-not-allowed text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Your Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="email"
                  value={session.user.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 text-zinc-400 cursor-not-allowed text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Subject Category
              </label>
              <div className="relative">
                <BookOpen
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Science">General Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English Language</option>
                  <option value="Spanish">Spanish Language</option>
                  <option value="History">History</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Price Per Hour ($)
              </label>
              <div className="relative">
                <DollarSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="number"
                  placeholder="30"
                  min="1"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Medium of Language
              </label>
              <div className="relative">
                <Globe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="English, Bengali, Spanish"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Photo URL (Pre-filled from Profile)
              </label>
              <div className="relative">
                <Globe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Experience (Years)
              </label>
              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="number"
                  placeholder="5"
                  min="0"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Total Slots Available
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="number"
                  placeholder="5"
                  min="1"
                  value={totalSlot}
                  onChange={e => setTotalSlot(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                Class Start Date
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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Detailed Description / Bio
            </label>
            <textarea
              rows="4"
              placeholder="Describe your qualifications, teaching methodology, syllabus coverage, and slot details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
              ) : (
                <>
                  <span>Submit Registration</span>
                  <PlusCircle size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
