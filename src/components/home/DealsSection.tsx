import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export function DealsSection() {
  // Get products with discounts
  const dealProducts = products.filter((p) => p.originalPrice).slice(0, 2);

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Limited Time Offers</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">
            Special <span className="text-accent">Deals</span>
          </h2>
          <p className="text-muted-foreground">
            Don't miss out on these amazing discounts
          </p>
        </div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {dealProducts.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-aura-surface to-background border border-border/30 hover:border-accent/40 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Image */}
                  <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/3] overflow-hidden">
                    <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50 md:block hidden" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center p-6 md:p-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 w-fit mb-4">
                      <span className="text-sm font-bold text-accent">{discount}% OFF</span>
                    </div>
                    
                    <span className="text-sm text-primary font-medium uppercase tracking-wider">
                      {product.brand}
                    </span>
                    
                    <h3 className="text-xl lg:text-2xl font-display font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl font-display font-bold text-accent">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice?.toLocaleString()}
                      </span>
                    </div>

                    <Button variant="accent" className="w-fit">
                      Shop Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}



