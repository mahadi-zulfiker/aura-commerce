import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/store";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${apiBase}/products?sort=featured&limit=8`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    const payload = (await response.json()) as PaginatedResponse<Product>;
    return payload.data;
  } catch {
    return [];
  }
}

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-aura-surface/60">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-muted-foreground">
              Handpicked selections from our latest collection
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

