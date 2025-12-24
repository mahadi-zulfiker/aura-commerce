import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/store";
import { imageBlurDataUrl } from "@/lib/placeholder";
import { CountdownTimer } from "./CountdownTimer";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getDealProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${apiBase}/products?sort=price-low&limit=8`, {
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
  } catch {
    return [];
  }
}

export async function DealsSection() {
  const products = await getDealProducts();
  const dealProducts = products.filter((p) => p.originalPrice).slice(0, 2);

  if (dealProducts.length === 0) return null;

  return (
    <section className="py-24 lg:py-32 bg-slate-950 text-white overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-6">
              <Zap className="h-4 w-4 text-accent fill-accent" />
              <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Flash Sale</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-black mb-4 tracking-tight">
              Exclusive <span className="text-accent">Deals</span>
            </h2>
            <p className="text-lg text-white/50 max-w-md">
              High-performance tech at unbeatable prices. Limited quantities available.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mb-1">Ends In:</span>
            <CountdownTimer />
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {dealProducts.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group relative h-full rounded-[2rem] overflow-hidden bg-white/[0.03] border border-white/10 hover:border-accent/30 transition-all duration-500 shadow-2xl"
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Image */}
                  <div className="relative w-full md:w-[45%] aspect-square md:aspect-auto overflow-hidden">
                    <Image
                      src={product.images[0] || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"}
                      alt={product.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 100vw"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      placeholder="blur"
                      blurDataURL={imageBlurDataUrl}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/80 md:block hidden" />
                    <div className="absolute top-6 left-6 z-20">
                      <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center shadow-xl shadow-accent/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <span className="text-sm font-black text-black leading-none">-{discount}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mb-2">
                      {product.brand}
                    </span>

                    <h3 className="text-2xl lg:text-3xl font-display font-black mb-4 leading-tight group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-end gap-3 mb-8">
                      <span className="text-4xl font-display font-black text-accent leading-none">
                        ${product.price.toLocaleString()}
                      </span>
                      <span className="text-lg text-white/30 line-through leading-none pb-1">
                        ${product.originalPrice?.toLocaleString()}
                      </span>
                    </div>

                    <div className="pt-6 border-t border-white/10 mt-auto">
                      <Button className="w-full rounded-full bg-white text-black hover:bg-accent hover:text-black transition-all duration-300 font-black uppercase tracking-widest h-14">
                        Claim Deal
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}




