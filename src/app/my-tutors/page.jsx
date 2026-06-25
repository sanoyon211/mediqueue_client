'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import {
  Edit2,
  Trash2,
  ShieldAlert,
  Check,
  X,
  BookOpen,
  DollarSign,
  Calendar,
} from 'lucide-react';
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

export default function MyTutors() {
  const router = useRouter();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [tutorToDelete, setTutorToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [subject, setSubject] = useState('');
  const [price, setPrice] = useState('');
  const [language, setLanguage] = useState('');
  const [experience, setExperience] = useState('');
  const [totalSlot, setTotalSlot] = useState('');
  const [startDate, setStartDate] = useState('');
  const [description, setDescription] = useState('');
  const [institution, setInstitution] = useState('');
  const [location, setLocation] = useState('');
  const [teachingMode, setTeachingMode] = useState('Online');
  const [availableDays, setAvailableDays] = useState('');
  const [availableTime, setAvailableTime] = useState('');

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
    document.title = 'My Registered Tutors - MediQueue';
    if (!isPending && !session) {
      toast.error('Please login to view your tutors!');
      router.push(`/login?callbackURL=${encodeURIComponent(window.location.pathname)}`);
    } else if (session) {
      fetchMyTutors();
    }
  }, [session, isPending]);

  const fetchMyTutors = async () => {
    try {
      setLoading(true);
      const token = await getJWTToken(session.user.email);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(
        `${apiUrl}/api/tutors/my-tutors?email=${session.user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setTutors(data.data);
      } else {
        setTutors([]);
      }
    } catch (err) {
      console.error(err);
      setTutors([]);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = tutor => {
    setSelectedTutor(tutor);
    setSubject(tutor.subject);
    setPrice(tutor.hourlyFee);
    setLanguage(tutor.language || '');
    setExperience(tutor.experience);
    setTotalSlot(tutor.totalSlot);
    setStartDate(
      tutor.sessionStartDate ? tutor.sessionStartDate.substring(0, 10) : '',
    );
    setDescription(tutor.description);
    setInstitution(tutor.institution || '');
    setLocation(tutor.location || '');
    setTeachingMode(tutor.teachingMode || 'Online');
    setAvailableDays(tutor.availableDays || '');
    setAvailableTime(tutor.availableTime || '');
    setIsUpdateOpen(true);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const token = await getJWTToken(session.user.email);

      const updateData = {
        tutorName: selectedTutor.tutorName,
        photo: selectedTutor.photo,
        subject,
        hourlyFee: Number(price),
        language,
        experience: Number(experience),
        totalSlot: Number(totalSlot),
        sessionStartDate: startDate,
        description,
        institution,
        location,
        teachingMode,
        availableDays,
        availableTime,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(
        `${apiUrl}/api/tutors/${selectedTutor._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        },
      );
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Tutor updated successfully!');
        setIsUpdateOpen(false);
        fetchMyTutors();
      } else {
        toast.error(data.message || 'Failed to update tutor details');
      }
    } catch (err) {
      toast.error('Network error during update.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const openDeleteModal = id => {
    setTutorToDelete(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const token = await getJWTToken(session.user.email);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(
        `${apiUrl}/api/tutors/${tutorToDelete}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Tutor deleted successfully!');
        setIsDeleteOpen(false);
        setTutors(tutors.filter(t => t._id !== tutorToDelete));
      } else {
        toast.error(data.message || 'Failed to delete tutor');
      }
    } catch (err) {
      toast.error('Network error during deletion.');
    } finally {
      setDeleteLoading(false);
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
    <div className="min-h-[calc(100vh-16rem)] py-8 px-4 sm:px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              My Registered Slots
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold mt-1">
              Manage and edit your registered tutoring subjects.
            </p>
          </div>
        </div>

        {tutors.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-xl mx-auto space-y-4 bg-white dark:bg-zinc-900">
            <div className="inline-flex p-3 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-500">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold">No Tutors Registered</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              You haven't added any tutor slots yet. Register your first subject
              to start receiving bookings!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-extrabold uppercase tracking-wider text-zinc-500">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6">Language</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Slots left</th>
                  <th className="py-4 px-6">Start Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 font-semibold">
                {tutors.map(t => (
                  <tr
                    key={t._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30 transition-colors"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={getTutorImage(t.photo, t.image)}
                        alt={t.tutorName}
                        className="w-9 h-9 rounded-full object-cover border border-violet-500/20"
                      />
                      <span className="text-zinc-900 dark:text-zinc-100 font-bold">
                        {t.tutorName}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-500">
                        {t.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6">{t.language || 'English'}</td>
                    <td className="py-4 px-6 text-zinc-900 dark:text-zinc-100 font-bold">
                      ${t.hourlyFee}/hr
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={
                          t.totalSlot > 0
                            ? 'text-emerald-600 font-bold'
                            : 'text-red-500 font-bold'
                        }
                      >
                        {t.totalSlot} slots
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-zinc-500">
                      {new Date(t.sessionStartDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => openUpdateModal(t)}
                        className="p-2 rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900 transition-colors"
                        title="Edit Details"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(t._id)}
                        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Slot"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isUpdateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Update Tutor Slot
              </h3>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="English">English Language</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Price per Hour ($)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Medium of Language
                    </label>
                    <input
                      type="text"
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Available Slots
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={totalSlot}
                      onChange={e => setTotalSlot(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Available Days
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sun - Thu"
                      value={availableDays}
                      onChange={e => setAvailableDays(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Available Time Slot
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5:00 PM - 8:00 PM"
                      value={availableTime}
                      onChange={e => setAvailableTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">
                      Teaching Mode
                    </label>
                    <select
                      value={teachingMode}
                      onChange={e => setTeachingMode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500 uppercase">
                    Description / Bio
                  </label>
                  <textarea
                    rows="4"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 hover:border-violet-500/30 focus:border-violet-500 focus:outline-none text-sm transition-all font-semibold"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsUpdateOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {updateLoading ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                    ) : (
                      <>
                        <span>Save Updates</span>
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

      <AnimatePresence>
        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteOpen(false)}
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
                Confirm Deletion
              </h3>
              <p className="text-zinc-500 text-sm font-semibold max-w-xs mx-auto">
                Are you absolutely sure you want to delete this tutor slot? This
                action cannot be undone.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDeleteOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
                  ) : (
                    <>
                      <span>Delete Slot</span>
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
