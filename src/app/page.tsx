import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { DealsSection } from "@/components/home/DealsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { FAQSection } from "@/components/home/FAQSection";
import { ProductGridSkeleton, CategoryGridSkeleton } from "@/components/home/HomeSkeletons";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategorySection />
      </Suspense>
      <Suspense fallback={<ProductGridSkeleton />}>
        <FeaturedProducts />
      </Suspense>
      <StatsSection />
      <Suspense fallback={<ProductGridSkeleton />}>
        <DealsSection />
      </Suspense>
      <BlogSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
