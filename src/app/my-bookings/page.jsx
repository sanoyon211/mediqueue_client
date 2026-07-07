'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { Calendar, Trash2, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


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

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const getJWTToken = async email => {
    try {
      let token = localStorage.getItem('jwt_token');
      let cachedEmail = localStorage.getItem('jwt_email');
      if (!token || cachedEmail !== email) {
        const res = await fetch(`/api/jwt`, {
          method: 'POST',
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
    document.title = 'My Bookings - MediQueue';
    if (!isPending && !session) {
      toast.error('Please login to view your booked sessions!');
      router.push(`/login?callbackURL=${encodeURIComponent(window.location.pathname)}`);
    } else if (session) {
      fetchMyBookings();
    }
  }, [session, isPending]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const token = await getJWTToken(session.user.email);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(
        `${apiUrl}/api/bookings/my-bookings?email=${session.user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = id => {
    setBookingToCancel(id);
    setIsCancelOpen(true);
  };

  const handleCancelBooking = async () => {
    try {
      setCancelLoading(true);
      const token = await getJWTToken(session.user.email);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(
        `${apiUrl}/api/bookings/${bookingToCancel}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Session cancelled successfully!');
        setIsCancelOpen(false);

        setBookings(
          bookings.map(b =>
            b._id === bookingToCancel ? { ...b, bookStatus: 'cancelled' } : b,
          ),
        );
      } else {
        toast.error(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      toast.error('Network error during cancellation.');
    } finally {
      setCancelLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 rounded-full border-4 border-blue-600 animate-spin border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] py-8 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Booked Sessions
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Review dates and manage status of booked study sessions.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl mx-auto space-y-4 bg-white dark:bg-slate-900/40">
            <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Bookings Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              You have not booked any slots yet. Head to the Tutors page to
              reserve your first study session!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Tutor Name</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Class Date</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm text-slate-700 dark:text-slate-300 font-medium">
                {bookings.map(b => (
                  <tr
                    key={b._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={getTutorImage(b.tutorPhoto, b.image)}
                        alt={b.tutorName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <span className="text-slate-900 dark:text-white font-bold">
                        {b.tutorName}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                        {b.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {new Date(
                        b.bookingDate || b.bookedAt,
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-slate-900 dark:text-white font-bold">
                      ${b.hourlyFee}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.bookStatus === 'cancelled'
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {b.bookStatus || 'booked'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {b.bookStatus !== 'cancelled' ? (
                        <button
                          onClick={() => openCancelModal(b._id)}
                          className="px-3.5 py-1.5 font-semibold text-xs bg-white dark:bg-slate-800 hover:bg-red-50 hover:dark:bg-red-900/20 border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 transition-all rounded-lg shadow-sm"
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                          No Action
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCancelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCancelOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6 text-center"
            >
              <div className="inline-flex p-3 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 mb-2">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cancel Session
              </h3>
              <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">
                Are you sure you want to cancel this study session? This will
                release the slot to other students.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCancelOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {cancelLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  ) : (
                    <>
                      <span>Cancel Session</span>
                      <Trash2 size={16} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
