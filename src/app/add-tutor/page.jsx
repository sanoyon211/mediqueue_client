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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [price, setPrice] = useState('');
  const [language, setLanguage] = useState('English');
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [totalSlot, setTotalSlot] = useState('');
  const [startDate, setStartDate] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [institution, setInstitution] = useState('');
  const [location, setLocation] = useState('');
  const [teachingMode, setTeachingMode] = useState('Online');
  const [availableDays, setAvailableDays] = useState('Sat, Sun');
  const [availableTime, setAvailableTime] = useState('10:00 AM - 12:00 PM');

  useEffect(() => {
    if (!isPending && !session) {
      toast.error('Please login to access this page!');
      router.push(`/login?callbackURL=${encodeURIComponent(window.location.pathname)}`);
    } else if (session) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
      setPhotoUrl(
        session.user.image ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      );
    }
  }, [session, isPending, router]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!price || !description || !experience || !totalSlot || !startDate || !institution || !location || !availableDays || !availableTime) {
      return toast.error('Please fill in all fields!');
    }

    const tutorData = {
      tutorName: name || session.user.name,
      photo: photoUrl || session.user.image,
      subject,
      hourlyFee: Number(price),
      totalSlot: Number(totalSlot),
      sessionStartDate: startDate,
      experience: Number(experience),
      language,
      description: description,
      availableDays: availableDays,
      availableTime: availableTime,
      institution: institution,
      location: location,
      teachingMode: teachingMode,
      creatorEmail: session.user.email,
      creatorName: session.user.name,
      creatorPhoto: session.user.image || photoUrl,
    };

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/tutors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutorData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Tutor registered successfully!');
        router.push('/my-tutors');
      } else {
        toast.error(data.message || 'Failed to add tutor');
      }
    } catch (err) {
      toast.error('Error connecting to server.');
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
    <div className="min-h-[calc(100vh-16rem)] py-12 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-10 shadow-xl"
      >
        <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
          <div className="p-3 rounded-2xl bg-violet-100 dark:bg-violet-900/40 text-violet-500">
            <PlusCircle size={28} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Register as a Tutor
            </h2>
            <p className="text-sm text-zinc-500 font-semibold mt-1">
              Add your tutoring slot profile details below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold">Your Name</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">Your Email</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold">Subject Category</label>
              <div className="relative">
                <BookOpen
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English Language</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">Price Per Hour ($)</label>
              <div className="relative">
                <DollarSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="30"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold">Medium of Language</label>
              <div className="relative">
                <Globe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">Photo URL</label>
              <div className="relative">
                <Globe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="url"
                  value={photoUrl}
                  onChange={e => setPhotoUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold">Experience (Years)</label>
              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="5"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">Total Slots</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="5"
                  value={totalSlot}
                  onChange={e => setTotalSlot(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">Class Start Date</label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold">Available Days (e.g. Sun - Thu)</label>
              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Sun - Thu"
                  value={availableDays}
                  onChange={e => setAvailableDays(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">Available Time Slot (e.g. 5:00 PM - 8:00 PM)</label>
              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="5:00 PM - 8:00 PM"
                  value={availableTime}
                  onChange={e => setAvailableTime(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold">Institution</label>
              <div className="relative">
                <BookOpen
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="University / School"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">Location (Area/City)</label>
              <div className="relative">
                <Globe
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Dhanmondi, Dhaka"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold">Teaching Mode</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <select
                  value={teachingMode}
                  onChange={e => setTeachingMode(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold">Description / Bio</label>
            <textarea
              rows="4"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 text-sm font-semibold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white animate-spin border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Submit Registration</span>
                <PlusCircle size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
