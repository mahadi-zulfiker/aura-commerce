"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { apiGet } from "@/lib/api";
import { imageBlurDataUrl } from "@/lib/placeholder";
import { PaginatedResponse } from "@/types/api";
import { Shop } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const fallbackBanners = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
];

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}

export default function ShopsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: ["shops", debouncedSearch, page],
    queryFn: () =>
      apiGet<PaginatedResponse<Shop>>("/shops", {
        page,
        limit: 12,
        search: debouncedSearch,
      }),
  });

  const shops = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Shop the Aura collective</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Discover vetted vendors, specialty studios, and curated brand partners.
          </p>
        </div>
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search shops..."
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden border-border/60">
              <Skeleton className="h-40 w-full" />
              <CardContent className="space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : shops.length === 0 ? (
        <Card className="border-border/60">
          <CardContent className="flex flex-col items-center text-center gap-3 py-10">
            <p className="text-lg font-semibold">No shops found</p>
            <p className="text-sm text-muted-foreground">
              Try a different search term or browse our featured products.
            </p>
            <Button variant="glow" asChild>
              <Link href="/products">Browse products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop, index) => {
              const banner = shop.banner || fallbackBanners[index % fallbackBanners.length];
              return (
                <Card key={shop.id} className="overflow-hidden border-border/60">
                  <div className="relative h-40">
                    <Image
                      src={banner}
                      alt={shop.name}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={imageBlurDataUrl}
                    />
                  </div>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl overflow-hidden border border-border/50 bg-muted/40 flex items-center justify-center">
                        {shop.logo ? (
                          <Image
                            src={shop.logo}
                            alt={`${shop.name} logo`}
                            width={48}
                            height={48}
                            placeholder="blur"
                            blurDataURL={imageBlurDataUrl}
                          />
                        ) : (
                          <span className="text-sm font-semibold text-muted-foreground">
                            {shop.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{shop.name}</h3>
                          {shop.isFeatured && <Badge variant="category">Featured</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {shop.city ? `${shop.city}, ` : ""}
                          {shop.country ?? "Global"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {shop.description || "Curated tech collections with premium support."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{shop._count?.products ?? 0} products</span>
                      <span>{shop._count?.followers ?? 0} followers</span>
                    </div>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/shops/${shop.slug}`}>Visit shop</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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
    </div>
  );
}
