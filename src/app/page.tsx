import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { DealsSection } from "@/components/home/DealsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <DealsSection />
      <TestimonialsSection />
    </>
  );
}
