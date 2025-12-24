"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, Search, ShoppingBag, Sparkles, Box, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
  const { data, isLoading } = useWishlist();
  const items = data ?? [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Heart className="h-3 w-3" />
            Selection Protocol
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Your <span className="text-primary italic">Wishlist.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Curated high-performance assets saved for future acquisition.</p>
        </div>
        <Button asChild className="h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all px-8">
          <Link href="/products">
            <Search className="mr-2 h-4 w-4" /> Discover More
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2.5rem] bg-white/5 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-6 rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01] animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-8 relative">
            <Heart className="h-10 w-10 text-white/10" />
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          </div>
          <h3 className="text-2xl font-display font-black text-white">Registry Empty</h3>
          <p className="text-white/30 text-sm font-medium mt-2 mb-10 text-center max-w-sm">You haven't flagged any assets for acquisition yet. Initialize your collection from the main catalog.</p>
          <Button asChild className="h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all px-10">
            <Link href="/products">Initialize Discovery</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard product={item.product} />
              {/* Optional overlay for dashboard specific interactions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div className="pt-10 flex flex-col items-center">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center gap-8 max-w-2xl w-full">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-display font-black text-white">Full Acquisition Protocol</h4>
              <p className="text-xs font-medium text-white/40 mt-1">Ready to commit to your selected assets? Transfer them to your primary terminal for checkout.</p>
            </div>
            <Button asChild className="h-12 rounded-xl bg-white text-slate-950 font-black uppercase tracking-widest text-[9px] hover:scale-105 active:scale-95 transition-all md:ml-auto">
              <Link href="/cart">Checkout Registry</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
