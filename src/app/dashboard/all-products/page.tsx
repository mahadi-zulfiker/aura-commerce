"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeaturedToggle } from "@/components/product/FeaturedToggle";
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  Box,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AllProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const { data, isLoading } = useQuery({
    queryKey: ["all-products", page, search, sort],
    queryFn: () =>
      apiGet<PaginatedResponse<Product>>("/products", {
        page,
        limit: 20,
        search: search || undefined,
        sort,
      }),
  });

  const products = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Package className="h-3 w-3" />
            Global Asset Registry
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Product <span className="text-primary italic">Intelligence.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Full-spectrum visibility into the global product catalog and market presence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search assets by designation..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-xs font-black uppercase tracking-widest focus:border-primary/50 transition-all placeholder:text-white/10"
          />
        </div>
        <div className="md:col-span-4 relative">
          <select
            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
          >
            <option value="newest" className="bg-slate-950">Reverse Chronological</option>
            <option value="price-low" className="bg-slate-950">Valuation: Descending</option>
            <option value="price-high" className="bg-slate-950">Valuation: Ascending</option>
            <option value="rating" className="bg-slate-950">Top-Tier Rating</option>
            <option value="popularity" className="bg-slate-950">High Demand</option>
          </select>
          <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
        </div>
      </div>

      <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Asset Designation</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Classification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">Telemetry</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Market Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse px-8 h-20"><td colSpan={4} className="bg-white/5" /></tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 mb-4">
                      <Box className="h-8 w-8 text-white/10" />
                    </div>
                    <p className="text-white/20 text-xs font-black uppercase tracking-widest">Zero assets found in matrix</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-primary group-hover:scale-105 transition-transform duration-500">
                          <LayoutGrid className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">ID: {product.id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/5">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <FeaturedToggle productId={product.id} isFeatured={product.isFeatured} />
                        <div className="flex items-center gap-2">
                          <TrendingUp className={cn("h-3 w-3", product.stockCount > 10 ? "text-emerald-500" : "text-destructive")} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Inventory: {product.stockCount}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xl font-display font-black text-white italic">${product.price.toLocaleString()}</p>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Authorized Rate</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <Button
            variant="ghost"
            className="h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
            disabled={page === 1}
            onClick={() => { setPage((prev) => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Node Previous
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-10 px-4 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{page} / {totalPages}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
            disabled={page === totalPages}
            onClick={() => { setPage((prev) => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Node Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
