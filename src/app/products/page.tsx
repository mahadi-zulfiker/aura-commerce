"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useBrands } from "@/hooks/use-brands";
import { SortOption } from "@/types/store";
import { cn } from "@/lib/utils";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "popularity", label: "Most Popular" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const selectedCategory = searchParams.get("category") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const searchQuery = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort");
  const sortBy =
    sortOptions.find((option) => option.value === sortParam)?.value ?? "featured";

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: productsResponse, isLoading, isError } = useProducts({
    category: selectedCategory || undefined,
    brand: selectedBrand || undefined,
    search: searchQuery || undefined,
    sort: sortBy,
    page: 1,
    limit: 12,
  });

  const products = productsResponse?.data ?? [];
  const totalProducts = productsResponse?.meta.total ?? 0;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = selectedCategory || selectedBrand || searchQuery;

  return (
    <div className="bg-background">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-aura-surface/60">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || "Products"
              : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? "Loading products..." : `${totalProducts} products found`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => updateFilter("q", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* Sort */}
            <select
              className="flex h-10 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={sortBy}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={cn(
              "w-64 shrink-0 space-y-6",
              "hidden lg:block",
              isFilterOpen &&
              "fixed inset-0 z-50 bg-background p-6 lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0 block",
            )}
          >
            {isFilterOpen && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-display font-semibold">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Filters</span>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <Badge
                      variant="category"
                      className="cursor-pointer"
                      onClick={() => updateFilter("category", "")}
                    >
                      {categories.find((c) => c.slug === selectedCategory)?.name}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {selectedBrand && (
                    <Badge
                      variant="category"
                      className="cursor-pointer"
                      onClick={() => updateFilter("brand", "")}
                    >
                      {brands.find((brand) => brand.slug === selectedBrand)?.name ??
                        selectedBrand}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Categories */}
            <div>
              <h4 className="font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedCategory === category.slug
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "hover:bg-muted",
                    )}
                    onClick={() =>
                      updateFilter(
                        "category",
                        selectedCategory === category.slug ? "" : category.slug,
                      )
                    }
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-muted-foreground">{category.productCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h4 className="font-medium mb-3">Brands</h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    className={cn(
                      "flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedBrand === brand.slug
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "hover:bg-muted",
                    )}
                    onClick={() =>
                      updateFilter(
                        "brand",
                        selectedBrand === brand.slug ? "" : brand.slug,
                      )
                    }
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isError ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium mb-2">Unable to load products</p>
                <p className="text-muted-foreground mb-4">
                  Please check your connection and try again.
                </p>
              </div>
            ) : isLoading ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1",
                )}
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
