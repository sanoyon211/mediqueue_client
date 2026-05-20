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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/jwt`, {
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500 animate-spin border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-16rem)] py-12 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            My Booked Sessions
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold mt-1">
            Review dates and manage status of booked study sessions.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl mx-auto space-y-4 bg-white dark:bg-zinc-900">
            <div className="inline-flex p-3 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-500">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold">No Bookings Found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              You have not booked any slots yet. Head to the Tutors page to
              reserve your first study session!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-extrabold uppercase tracking-wider text-zinc-500">
                  <th className="py-4 px-6">Tutor Name</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Class Date</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 font-semibold">
                {bookings.map(b => (
                  <tr
                    key={b._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={getTutorImage(b.tutorPhoto, b.image)}
                        alt={b.tutorName}
                        className="w-9 h-9 rounded-full object-cover border border-violet-500/20"
                      />
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                        {b.tutorName}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                        {b.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-500">
                      
                      {new Date(
                        b.bookingDate || b.bookedAt,
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-zinc-900 dark:text-zinc-100 font-bold">
                      ${b.hourlyFee}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          b.bookStatus === 'cancelled'
                            ? 'bg-red-100 dark:bg-red-950/40 text-red-500'
                            : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {b.bookStatus || 'booked'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {b.bookStatus !== 'cancelled' ? (
                        <button
                          onClick={() => openCancelModal(b._id)}
                          className="px-3.5 py-1.5 font-bold text-xs bg-red-500/10 hover:bg-red-600 hover:text-white border border-red-500/10 text-red-600 dark:text-red-400 transition-all rounded-lg"
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 text-xs font-bold">
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
              className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6 text-center"
            >
              <div className="inline-flex p-3 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 mb-2">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Cancel Session
              </h3>
              <p className="text-zinc-500 text-sm font-semibold max-w-xs mx-auto">
                Are you sure you want to cancel this study session? This will
                release the slot to other students.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCancelOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-650 text-sm font-bold hover:bg-zinc-100 transition-all"
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelLoading}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
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
