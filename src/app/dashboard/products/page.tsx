"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  ArrowUpRight,
  Filter,
  Layers,
  Zap,
  Box
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VendorProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-products"],
    queryFn: () => apiGet<PaginatedResponse<Product>>("/products/mine"),
  });

  const products = data?.data ?? [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Layers className="h-3 w-3" />
            Inventory Protocol
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Product <span className="text-primary italic">Catalog.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Manage your high-performance assets and stock levels.</p>
        </div>
        <Button asChild className="h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all px-8">
          <Link href="/dashboard/products/add">
            <Plus className="mr-2 h-4 w-4" /> Initialize Item
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <input
            placeholder="Search assets by name or ID..."
            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:border-primary/50 focus:ring-primary/20 transition-all placeholder:text-white/10"
          />
        </div>
        <Button variant="outline" className="h-14 w-14 md:w-auto rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Filter</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 rounded-[2.5rem] bg-white/5 border border-white/5" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.01]">
          <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-6">
            <Box className="h-10 w-10 text-white/20" />
          </div>
          <h3 className="text-xl font-display font-black text-white">No Assets Found</h3>
          <p className="text-white/40 text-sm font-medium mt-2 mb-8">Your specialized catalog is currently empty.</p>
          <Button asChild className="h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10">
            <Link href="/dashboard/products/add">Create First Item</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col rounded-[2.5rem] bg-white/[0.03] border border-white/5 overflow-hidden hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500"
            >
              {/* Product Visual */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-slate-950/80 backdrop-blur-md text-[8px] font-black uppercase tracking-widest border-white/10">
                    {product.category}
                  </Badge>
                  {product.stockCount <= 5 && (
                    <Badge className="bg-orange-500/20 text-orange-400 border-none animate-pulse text-[8px] font-black uppercase tracking-widest backdrop-blur-md">
                      Low Stock
                    </Badge>
                  )}
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                        <MoreVertical className="h-4 w-4 text-white" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white rounded-2xl p-1 w-40">
                      <DropdownMenuItem asChild className="rounded-xl h-10 px-3 cursor-pointer">
                        <Link href={`/dashboard/products/edit/${product.id}`} className="flex items-center gap-2">
                          <Edit3 className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Modify</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl h-10 px-3 cursor-pointer">
                        <Link href={`/product/${product.slug}`} className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Inspect</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl h-10 px-3 cursor-pointer text-destructive focus:bg-destructive/10">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Protocol Nullify</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-black text-white group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate max-w-[150px]">{product.id.slice(-12)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-display font-black text-primary">${product.price.toLocaleString()}</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">Market Value</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full shadow-glow-primary animate-pulse",
                      product.stockCount > 5 ? "bg-primary" : "bg-orange-500"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{product.stockCount} Units available</span>
                  </div>
                  <Link href={`/dashboard/products/edit/${product.id}`} className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
