"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductReviews } from "@/components/product/ProductReviews";
import { useProduct } from "@/hooks/use-product";
import { useProducts } from "@/hooks/use-products";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { imageBlurDataUrl } from "@/lib/placeholder";
import { toast } from "sonner";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, openCart } = useCartStore();

  const { data: product, isLoading, isError } = useProduct(params.slug);
  const relatedCategory = product?.categorySlug || product?.category?.toLowerCase();
  const { data: relatedResponse } = useProducts(
    { category: relatedCategory, limit: 8, sort: "featured" },
    { enabled: Boolean(relatedCategory) },
  );

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button asChild>
              <Link href="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const galleryImages = product.images.length > 0 ? product.images : ["/placeholder.svg"];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const relatedProducts =
    relatedResponse?.data.filter((item) => item.id !== product.id).slice(0, 4) ?? [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`, {
      action: {
        label: "View Cart",
        onClick: () => openCart(),
      },
    });
  };

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-aura-surface/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              href={`/products?category=${product.categorySlug || product.category.toLowerCase()}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border/50">
              <Image
                src={galleryImages[selectedImage]}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={imageBlurDataUrl}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">NEW</Badge>}
                {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  variant="glass"
                  size="icon"
                  onClick={() => {
                    setIsWishlisted(!isWishlisted);
                    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
                  }}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isWishlisted && "fill-destructive text-destructive",
                    )}
                  />
                </Button>
                <Button variant="glass" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {galleryImages.map((image, index) => (
                <button
                  key={image}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index
                      ? "border-primary shadow-glow"
                      : "border-border/50 hover:border-primary/50",
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    placeholder="blur"
                    blurDataURL={imageBlurDataUrl}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-primary font-medium uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-3xl lg:text-4xl font-display font-bold">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`${product.id}-star-${i}`}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-display font-bold text-primary">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <Badge variant="sale" className="text-sm">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </Badge>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border/50 rounded-xl overflow-hidden h-12 bg-muted/20">
                  <button
                    className="px-4 h-full hover:bg-muted/50 transition-colors disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                  <button
                    className="px-4 h-full hover:bg-muted/50 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  className="flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-border/50">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders over $500" },
                { icon: Shield, label: "Secure Payment", sub: "100% encrypted" },
                { icon: RotateCcw, label: "Easy Returns", sub: "30-day window" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center sm:items-start gap-2 p-4 rounded-2xl bg-muted/20 border border-white/5">
                  <item.icon className="h-5 w-5 text-primary" />
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{item.label}</p>
                    <p className="text-[9px] text-muted-foreground font-medium mt-1">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="pt-6 mt-6 border-t border-border/50 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground font-medium">
                  <span className="text-foreground font-bold italic mr-1">In Stock:</span>
                  Usually ships within 24 hours
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Order Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs / Sections */}
        <div className="mt-16 space-y-16">
          {/* Overview */}
          <section id="overview" className="scroll-mt-24">
            <h2 className="text-2xl font-display font-bold mb-6">Product Overview</h2>
            <div className="prose prose-aura max-w-none text-muted-foreground">
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </section>

          {/* Specifications */}
          {Object.keys(product.specifications).length > 0 && (
            <section id="specifications" className="scroll-mt-24 pt-16 border-t border-border/50">
              <h2 className="text-2xl font-display font-bold mb-8">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col pb-4 border-b border-border/30">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      {key}
                    </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section id="reviews" className="scroll-mt-24 pt-16 border-t border-border/50">
            <h2 className="text-2xl font-display font-bold mb-8 text-center sm:text-left">
              Customer <span className="text-primary">Reviews</span>
            </h2>
            <ProductReviews
              productId={product.id}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section id="related" className="scroll-mt-24 pt-16 border-t border-border/50">
              <h2 className="text-2xl font-display font-bold mb-8">Suggested for You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="bg-background">
      <div className="border-b border-border/50 bg-aura-surface/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-4 w-32 mb-8" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="grid grid-cols-1 gap-4 pt-6 border-t border-border/50 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-xl" />
              ))}
            </div>
            <div className="pt-6 border-t border-border/50 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
