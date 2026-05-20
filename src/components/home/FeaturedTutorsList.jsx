import React from 'react';
import Link from 'next/link';
import { Star, DollarSign, ArrowRight, UserCheck } from 'lucide-react';

async function getFeaturedTutors() {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/tutors/featured`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error();
    const data = await res.json();

    return data.success && data.data ? data.data : [];
  } catch (error) {
    return [];
  }
}


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

export default async function FeaturedTutorsList() {
  const tutors = await getFeaturedTutors();

  if (tutors.length === 0) {
    return (
      <div className="text-center py-16 px-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl mx-auto space-y-4 mb-10 md:mb-20">
        <div className="inline-flex p-3 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-500">
          <UserCheck size={32} />
        </div>
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
          No Tutors Available
        </h3>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
          We could not find any tutors in our database right now. Add tutors to
          display them here!
        </p>
      </div>
    );
  }

  return (
    <>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {tutors.map(tutor => (
          <div
            key={tutor._id}
            className="flex flex-col h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md hover:border-violet-500/30 transition-all duration-300 group"
          >

            <div className="p-6 flex-grow space-y-5">

              <div className="flex gap-4 items-center">
                <img
                  src={getTutorImage(tutor.photo, tutor.image)} 
                  alt={tutor.tutorName || tutor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/20 group-hover:border-violet-500 transition-colors"
                />
                <div>
                  <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100 line-clamp-1 group-hover:text-violet-500 transition-colors">
                    {tutor.tutorName || tutor.name}
                  </h3>

                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {tutor.rating ? tutor.rating.toFixed(1) : '5.0'} / 5.0
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
                    {tutor.totalSlot} slots available
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
          </div>
        ))}
      </div>


      <div className="text-center mt-16">
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 px-8 py-3.5 font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
        >
          <span>See All Tutors</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
