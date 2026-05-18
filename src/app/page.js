import FeaturedTutorsHeader from "@/components/home/FeaturedTutorsHeader";
import FeaturedTutorsList from "@/components/home/FeaturedTutorsList";

import FeaturedTutorsSkeleton from "@/components/home/FeaturedTutorsSkeleton";
import HeroBanner from "@/components/home/HeroBanner";
import { Suspense } from "react";



export default function Home() {
  return (
    <div className="w-full">
      <HeroBanner />
      <FeaturedTutorsHeader/>
      <Suspense fallback={<FeaturedTutorsSkeleton />}>
        <FeaturedTutorsList />
      </Suspense>
    </div>
  );
}
