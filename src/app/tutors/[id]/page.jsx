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
  BookOpen,
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
  const [phone, setPhone] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const { data: session } = authClient.useSession();

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
    if (params.id) {
      fetchTutorDetails();
      fetchReviews();
    }
  }, [params.id]);

  const fetchTutorDetails = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/tutors/${params.id}`);
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

  const fetchReviews = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/reviews/tutor/${params.id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleSubmitReview = async e => {
    e.preventDefault();
    if (!session) {
      toast.error('Please login to leave a review!');
      return router.push(`/login?callbackURL=${encodeURIComponent(window.location.pathname)}`);
    }
    if (!feedbackText.trim()) {
      return toast.error('Please enter feedback text!');
    }
    try {
      setReviewLoading(true);
      const token = await getJWTToken(session.user.email);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorId: params.id,
          userName: session.user.name,
          userEmail: session.user.email,
          rating: Number(reviewRating),
          feedbackText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Review submitted successfully!');
        setIsReviewOpen(false);
        setFeedbackText('');
        setReviewRating(5);
        fetchTutorDetails();
        fetchReviews();
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      toast.error('Network error during review submission.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleOpenBookingModal = () => {
    if (!session) {
      toast.error('Please login to book a session!');
      return router.push(`/login?callbackURL=${encodeURIComponent(window.location.pathname)}`);
    }

    if (tutor.totalSlot <= 0) {
      return toast.error('No available slots left.');
    }

    const sessionStartDate = new Date(tutor.sessionStartDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today < sessionStartDate) {
      return toast.error('Booking is not available yet for this tutor');
    }

    setIsModalOpen(true);
  };

  const handleConfirmBooking = async e => {
    e.preventDefault();
    if (!bookingDate) return toast.error('Please select a booking date!');
    if (!phone) return toast.error('Please enter your phone number!');

    try {
      setBookingLoading(true);
      const token = await getJWTToken(session.user.email);

      const bookingData = {
        tutorId: tutor._id,
        tutorName: tutor.tutorName,
        subject: tutor.subject,
        price: tutor.hourlyFee,
        image: tutor.photo,
        phone,
        bookingDate,
        studentEmail: session.user.email,
        studentName: session.user.name,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/bookings`, {
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
    <div className="min-h-[calc(100vh-16rem)] py-8 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Tutors list</span>
        </button>

        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 p-5 sm:p-8 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <img
              src={getTutorImage(tutor.photo, tutor.image)}
              alt={tutor.tutorName}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
            />
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {tutor.tutorName}
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {tutor.creatorEmail}
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tutor.subject}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>
                    {tutor.rating ? tutor.rating.toFixed(1) : '5.0'} / 5.0
                  </span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">About the Tutor</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {tutor.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 border-t border-slate-200 dark:border-slate-800 pt-6">
              <div className="flex items-center gap-2">
                <DollarSign className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Price Rate
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    ${tutor.hourlyFee}/hour
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Language
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {tutor.language || 'English'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Experience
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {tutor.experience} Years
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Check className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Teaching Mode
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {tutor.teachingMode || 'Online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]" title={tutor.location}>
                    {tutor.location || 'Online'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="text-blue-500 w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    Institution
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]" title={tutor.institution}>
                    {tutor.institution || 'Self-Employed'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 p-5 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left w-full md:w-auto">
            <div className="flex flex-col gap-2 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Calendar size={16} className="text-blue-500 flex-shrink-0" />
                <span>
                  Start Date: {new Date(tutor.sessionStartDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Clock size={16} className="text-blue-500 flex-shrink-0" />
                <span className="text-left">
                  Schedule: {tutor.availableDays || 'Sat, Sun'} ({tutor.availableTime || '10:00 AM - 12:00 PM'})
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm">
              {tutor.totalSlot > 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {tutor.totalSlot} slots left before booking closes!
                </span>
              ) : (
                <span className="text-red-500 font-bold">
                  This session is fully booked. You can’t join at the moment.
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleOpenBookingModal}
            disabled={tutor.totalSlot <= 0}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              tutor.totalSlot > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {tutor.totalSlot > 0 ? 'Book a Private Session' : 'Fully Booked'}
          </button>
        </div>

        {/* Reviews Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 p-5 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Student Reviews & Feedback</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Read what others say or share your own experience.
              </p>
            </div>
            {session && (
              <button
                onClick={() => setIsReviewOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all rounded-lg"
              >
                Write a Review
              </button>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 font-medium text-sm">
              No reviews yet. Be the first to share your learning experience!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center font-bold text-sm uppercase">
                        {r.userName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{r.userName}</p>
                        <p className="text-xs text-slate-500 font-medium">{r.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{r.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {r.feedbackText}
                  </p>
                </div>
              ))}
            </div>
          )}
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
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6"
            >
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Confirm Booking
              </h3>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Booking with
                  </p>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {tutor.tutorName}
                  </p>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {tutor.subject} ({tutor.language || 'English'})
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Target Date
                  </label>
                  <input
                    type="date"
                    min={tutor.sessionStartDate}
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +88017XXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Student Name
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {session?.user?.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Student Email
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4 text-sm font-extrabold">
                  <span className="text-slate-500">Hourly Rate:</span>
                  <span className="text-slate-900 dark:text-white">
                    ${tutor.hourlyFee} / hr
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2"
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

        {isReviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6"
            >
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Write a Review
              </h3>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Name
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {session?.user?.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Email
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Rating (1 to 5)
                  </label>
                  <select
                    value={reviewRating}
                    onChange={e => setReviewRating(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Review / Feedback
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Describe your learning experience with this tutor..."
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsReviewOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-[0_0_20px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {reviewLoading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                    ) : (
                      'Submit Review'
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
