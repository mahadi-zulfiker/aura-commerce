import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/products";

export function CategorySection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">
              Shop by Category
            </h2>
            <p className="text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="category-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square relative overflow-hidden">
                {/* Background Image */}
                <Image src={category.image} alt={category.name} fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.productCount} Products
                  </p>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <Link
          href="/products"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm font-medium text-primary"
        >
          View All Categories
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}


