'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Star,
  DollarSign,
  Calendar,
  Clock,
  Globe,
  Award,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const getTutorImage = (photo, image) => {
  const url = photo || image;
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
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
    return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  }
  return url;
};

export default function TutorDetails() {
  const params = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const { data: session } = authClient.useSession();

  const getJWTToken = async email => {
    try {
      let token = localStorage.getItem('jwt_token');
      let cachedEmail = localStorage.getItem('jwt_email');
      if (!token || cachedEmail !== email) {
        const res = await fetch('http://localhost:5000/api/jwt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (data.success) {
          token = data.token;
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('jwt_email', email);
        }
      }
      return token;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTutorDetails();
    }
  }, [params.id]);

  const fetchTutorDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tutors/${params.id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTutor(data.data);
        document.title = `${data.data.tutorName} - Tutor Details`;
      } else {
        toast.error('Tutor details not found');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookingModal = () => {
    if (!session) {
      toast.error('Please login to book a session!');
      return router.push('/login');
    }

    if (tutor.totalSlot <= 0) {
      return toast.error('This tutor has no slots available!');
    }

    const sessionStartDate = new Date(tutor.sessionStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sessionStartDate < today) {
      return toast.error(
        'This session date has already passed. Booking is closed.',
      );
    }

    setIsModalOpen(true);
  };

  const handleConfirmBooking = async e => {
    e.preventDefault();
    if (!bookingDate) return toast.error('Please select a booking date!');

    try {
      setBookingLoading(true);
      const token = await getJWTToken(session.user.email);

      const bookingData = {
        tutorId: tutor._id,
        tutorName: tutor.tutorName,
        subject: tutor.subject,
        price: tutor.hourlyFee,
        image: tutor.photo,
        phone: '01712-345678',
        bookingDate,
        studentEmail: session.user.email,
        studentName: session.user.name,
      };

      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Tutor session booked successfully!');
        setIsModalOpen(false);
        fetchTutorDetails();
        router.push('/my-bookings');
      } else {
        toast.error(data.message || 'Failed to book session');
      }
    } catch (err) {
      toast.error('Network error during booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500 animate-spin border-t-transparent" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center space-y-4">
        <ShieldAlert size={48} className="text-red-500" />
        <h2 className="text-xl font-bold">Tutor Not Found</h2>
        <button
          onClick={() => router.back()}
          className="text-violet-500 font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] py-12 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Tutors list</span>
        </button>

        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <img
              src={getTutorImage(tutor.photo, tutor.image)}
              alt={tutor.tutorName}
              className="w-36 h-36 rounded-full object-cover border-4 border-violet-500/20 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-100">
                {tutor.tutorName}
              </h2>
              <p className="text-sm font-semibold text-zinc-500 mt-1">
                {tutor.creatorEmail}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-violet-100 dark:bg-violet-955 text-violet-650">
                  {tutor.subject}
                </span>
                <span className="flex items-center gap-1 text-xs font-extrabold text-zinc-500">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>
                    {tutor.rating ? tutor.rating.toFixed(1) : '5.0'} / 5.0
                  </span>
                </span>
              </div>

              <h3 className="text-xl font-bold">About the Tutor</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">
                {tutor.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className="text-emerald-500 w-5 h-5" />
                <div>
                  <p className="text-xs text-zinc-400 font-bold uppercase">
                    Price Rate
                  </p>
                  <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                    ${tutor.hourlyFee}/hour
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="text-violet-500 w-5 h-5" />
                <div>
                  <p className="text-xs text-zinc-400 font-bold uppercase">
                    Language
                  </p>
                  <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                    {tutor.language || 'English'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="text-indigo-500 w-5 h-5" />
                <div>
                  <p className="text-xs text-zinc-400 font-bold uppercase">
                    Experience
                  </p>
                  <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                    {tutor.experience} Years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-700 dark:text-zinc-300 font-bold">
              <Calendar size={18} className="text-violet-500" />
              <span>
                Available Date:{' '}
                {new Date(tutor.sessionStartDate).toLocaleDateString()}
              </span>
            </div>
            <div className="text-sm">
              {tutor.totalSlot > 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {tutor.totalSlot} slots left before booking closes!
                </span>
              ) : (
                <span className="text-red-500 font-extrabold">
                  No slots available. Fully Booked.
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleOpenBookingModal}
            disabled={tutor.totalSlot <= 0}
            className={`px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all duration-300 ${
              tutor.totalSlot > 0
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
            }`}
          >
            {tutor.totalSlot > 0 ? 'Book a Private Session' : 'Fully Booked'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6"
            >
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Confirm Booking
              </h3>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl space-y-1">
                  <p className="text-xs text-zinc-400 font-bold uppercase">
                    Booking with
                  </p>
                  <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
                    {tutor.tutorName}
                  </p>
                  <p className="text-xs font-semibold text-violet-500">
                    {tutor.subject} ({tutor.language || 'English'})
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">
                    Select Target Date
                  </label>
                  <input
                    type="date"
                    min={tutor.sessionStartDate}
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-955/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold text-zinc-800 dark:text-zinc-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-400 font-bold uppercase">
                      Student Name
                    </p>
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">
                      {session?.user?.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-zinc-400 font-bold uppercase">
                      Student Email
                    </p>
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-4 text-sm font-extrabold">
                  <span className="text-zinc-500">Hourly Rate:</span>
                  <span className="text-zinc-800 dark:text-zinc-200">
                    ${tutor.hourlyFee} / hr
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-650 text-sm font-bold hover:bg-zinc-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                    ) : (
                      <>
                        <span>Confirm</span>
                        <Check size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
