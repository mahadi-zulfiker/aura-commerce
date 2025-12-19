"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Store, Users } from "lucide-react";

import { apiDelete, apiGet, apiPost } from "@/lib/api";
import { imageBlurDataUrl } from "@/lib/placeholder";
import { PaginatedResponse } from "@/types/api";
import { Product, Shop } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product/ProductCard";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

const fallbackBanners = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
];

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);

  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const { data: shop, isLoading: isShopLoading } = useQuery({
    queryKey: ["shop", slug],
    queryFn: () => apiGet<Shop>(`/shops/${slug}`),
    enabled: Boolean(slug),
  });

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["shop-products", slug, page],
    queryFn: () =>
      apiGet<PaginatedResponse<Product>>(`/shops/${slug}/products`, {
        page,
        limit: 12,
      }),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    setIsFollowing(false);
  }, [shop?.id]);

  const followMutation = useMutation({
    mutationFn: () => apiPost(`/shops/${shop?.id}/follow`, {}),
    onSuccess: () => {
      setIsFollowing(true);
      queryClient.invalidateQueries({ queryKey: ["shop", slug] });
      toast.success("Following shop");
    },
    onError: (error: any) => {
      setIsFollowing(true);
      toast.error("Unable to follow", {
        description: error?.message || "Please try again.",
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => apiDelete(`/shops/${shop?.id}/follow`),
    onSuccess: () => {
      setIsFollowing(false);
      queryClient.invalidateQueries({ queryKey: ["shop", slug] });
      toast.success("Unfollowed shop");
    },
    onError: (error: any) => {
      toast.error("Unable to unfollow", {
        description: error?.message || "Please try again.",
      });
    },
  });

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      toast.message("Login required", {
        description: "Sign in to follow shops.",
      });
      router.push("/auth/login");
      return;
    }

    if (!shop) {
      return;
    }

    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const banner = shop?.banner || fallbackBanners[0];
  const products = productsData?.data ?? [];
  const meta = productsData?.meta;

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-10">
      {isShopLoading ? (
        <Card className="overflow-hidden border-border/60">
          <Skeleton className="h-56 w-full" />
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ) : shop ? (
        <Card className="overflow-hidden border-border/60">
          <div className="relative h-56">
            <Image
              src={banner}
              alt={shop.name}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={imageBlurDataUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          </div>
          <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden border border-border/60 bg-muted/40 flex items-center justify-center">
                {shop.logo ? (
                  <Image
                    src={shop.logo}
                    alt={`${shop.name} logo`}
                    width={64}
                    height={64}
                    placeholder="blur"
                    blurDataURL={imageBlurDataUrl}
                  />
                ) : (
                  <Store className="h-7 w-7 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-display font-bold">{shop.name}</h1>
                  {shop.isFeatured && <Badge variant="category">Featured</Badge>}
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {shop.description || "Curated tech collections with premium support."}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>{shop._count?.products ?? 0} products</span>
                  <span>{shop._count?.followers ?? 0} followers</span>
                  <span>Rating {shop.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <Button
              variant={isFollowing ? "outline" : "glow"}
              onClick={handleFollowToggle}
              disabled={followMutation.isPending || unfollowMutation.isPending}
            >
              <Heart className="h-4 w-4" />
              {isFollowing ? "Following" : "Follow shop"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/60">
          <CardContent className="py-10 text-center text-muted-foreground">
            Shop not found.
          </CardContent>
        </Card>
      )}

      {shop && (
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border/60">
            <CardContent className="space-y-3">
              <h2 className="text-xl font-semibold">About this shop</h2>
              <p className="text-sm text-muted-foreground">
                {shop.description ||
                  "Aura Commerce partners with premium vendors who meet our quality, design, and support standards."}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Users className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Shop details</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {shop.city || shop.country ? (
                  <p>
                    Location: {shop.city ? `${shop.city}, ` : ""}
                    {shop.country ?? "Global"}
                  </p>
                ) : null}
                {shop.website ? <p>Website: {shop.website}</p> : null}
                {shop.email ? <p>Email: {shop.email}</p> : null}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Shop products</h2>
        </div>
        {isProductsLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="border-border/60">
            <CardContent className="py-10 text-center text-muted-foreground">
              No products available yet.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {meta && (
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
