import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/store";
import { CategoryGrid } from "./CategoryGrid";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${apiBase}/categories`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    const payload = await response.json();
    if (payload && Array.isArray(payload.data)) {
      return payload.data;
    }
    if (Array.isArray(payload)) {
      return payload;
    }
    return [];
  } catch {
    return [];
  }
}

export async function CategorySection() {
  const categories = await getCategories();

  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-4 tracking-tight">
              Curated <span className="gradient-text">Collections</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our thoughtfully organized categories. From cutting-edge Gadgets to essential accessories, find exactly what fits your lifestyle.
            </p>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-3 text-sm font-bold text-primary uppercase tracking-widest"
          >
            <span>View All Categories</span>
            <div className="h-10 w-10 flex items-center justify-center rounded-full border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Category Grid */}
        <CategoryGrid categories={categories} />

        {/* Mobile View All */}
        <div className="mt-12 md:hidden">
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border font-bold text-primary uppercase tracking-widest text-xs"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}



