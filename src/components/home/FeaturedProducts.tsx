import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/types/store";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${apiBase}/products?featured=1&limit=8`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    const payload = await response.json();
    if (payload && payload.data && Array.isArray(payload.data.data)) {
      return payload.data.data;
    }
    if (payload && Array.isArray(payload.data)) {
      return payload.data;
    }
    if (Array.isArray(payload)) {
      return payload;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  const featuredProducts = products.slice(0, 8); // Showing 8 products

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Our Favorites</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-4 tracking-tight">
              Featured <span className="gradient-text">Masterpieces</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore our handpicked selection of premium electronics. Each piece is chosen for its exceptional design and performance.
            </p>
          </div>
          <Button variant="outline" size="lg" className="rounded-full border-primary/20 hover:border-primary px-8" asChild>
            <Link href="/products">
              Explore All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {featuredProducts.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-3xl">
            <p className="text-muted-foreground">No featured products found.</p>
          </div>
        )}
      </div>
    </section>
  );
}


