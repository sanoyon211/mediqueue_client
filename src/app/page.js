import ExtraSections from '@/components/home/ExtraSections';
import FeaturedTutorsHeader from '@/components/home/FeaturedTutorsHeader';
import FeaturedTutorsList from '@/components/home/FeaturedTutorsList';

import FeaturedTutorsSkeleton from '@/components/home/FeaturedTutorsSkeleton';
import HeroBanner from '@/components/home/HeroBanner';
import { Suspense } from 'react';

export default function Home() {
  return (
    <div className="w-full">
      <HeroBanner />
      <section className="py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto transition-colors duration-300">
        <FeaturedTutorsHeader />
        <Suspense fallback={<FeaturedTutorsSkeleton />}>
          <FeaturedTutorsList />
        </Suspense>
      </section>
      <ExtraSections/>
    </div>
  );
}
