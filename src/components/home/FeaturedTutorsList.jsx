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
      <div className="text-center py-16 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl mx-auto space-y-4 mb-10 md:mb-20">
        <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500">
          <UserCheck size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          No Tutors Available
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
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
            className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300 group"
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
                    <Star size={14} className="fill-amber-400 text-amber-400" />
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
                    {tutor.totalSlot} slots available
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
          </div>
        ))}
      </div>


      <div className="text-center mt-12">
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 px-8 py-3 font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 rounded-xl shadow-sm hover:shadow"
        >
          <span>See All Tutors</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
