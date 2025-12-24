"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Eye, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/store";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { imageBlurDataUrl } from "@/lib/placeholder";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, openCart } = useCartStore();

  const primaryImage = product.images[0] || "/placeholder.svg";
  const hoverImage = product.images[1] || primaryImage;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`, {
      action: {
        label: "View Cart",
        onClick: () => openCart(),
      },
    });
  };

  const handleWishlist = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("group relative h-full", className)}
    >
      <Link href={`/product/${product.slug}`} className="block h-full">
        <div className="product-card h-full flex flex-col bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/40 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
          {/* Image Container */}
          <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
            <Image
              src={isHovered ? hoverImage : primaryImage}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              placeholder="blur"
              blurDataURL={imageBlurDataUrl}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.isNew && (
                <Badge className="bg-primary text-white border-none px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-primary/20">
                  NEW
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-accent text-white border-none px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-accent/20">
                  {discount}% OFF
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              <Button
                variant="glass"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full transition-all duration-300 translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-100",
                  "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-xl text-foreground"
                )}
                onClick={handleWishlist}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isWishlisted ? "fill-red-500 text-red-500" : "text-foreground"
                  )}
                />
              </Button>
              <Button
                variant="glass"
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-full transition-all duration-300 translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 delay-75",
                  "bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 shadow-xl text-foreground"
                )}
              >
                <Eye className="h-5 w-5 text-foreground" />
              </Button>
            </div>

            {/* Add to Cart Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-500 translate-y-full group-hover:translate-y-0">
              <Button
                className="w-full rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 font-bold tracking-wide h-12 shadow-xl"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Add To Cart" : "Out of Stock"}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">
                {product.brand}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-xs font-bold">{product.rating}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>

            <div className="mt-auto flex items-end justify-between">
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through decoration-primary/30">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl font-display font-black text-primary leading-none">
                  ${product.price.toLocaleString()}
                </span>
              </div>

              <div className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                <ArrowUpRight className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* In stock info */}
            {product.inStock && product.stockCount < 5 && (
              <p className="text-[10px] font-bold text-accent mt-4 animate-pulse uppercase tracking-widest">
                Only {product.stockCount} items left!
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
