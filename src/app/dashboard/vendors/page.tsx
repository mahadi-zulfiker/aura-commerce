"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Store,
  Search,
  Filter,
  CheckCircle,
  Ban,
  MoreVertical,
  Mail,
  Globe,
  ExternalLink,
  Loader2,
  ChevronDown,
  ShieldCheck,
  Building2,
  Clock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ShopAdmin {
  id: string;
  name: string;
  email: string;
  status: string;
  slug: string;
}

export default function VendorsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-shops", page, statusFilter],
    queryFn: () =>
      apiGet<PaginatedResponse<ShopAdmin>>("/shops/admin/all", {
        page,
        limit: 20,
        status: statusFilter || undefined,
      }),
  });

  const shops = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const filteredShops = useMemo(() => {
    if (!search) return shops;
    return shops.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, shops]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiPatch(`/shops/${id}/status`, { status });
      toast.success(`Merchant protocol updated to ${status}`);
      refetch();
    } catch (error) {
      toast.error("Operation failure");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Building2 className="h-3 w-3" />
            Partner Infrastructure
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Merchant <span className="text-primary italic">Applications.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Review and synchronize high-performance merchant nodes within the ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Locate merchant by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-xs font-black uppercase tracking-widest focus:border-primary/50 transition-all placeholder:text-white/10"
          />
        </div>
        <div className="relative">
          <select
            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="" className="bg-slate-950">All Applications</option>
            <option value="PENDING" className="bg-slate-950">Awaiting Review</option>
            <option value="APPROVED" className="bg-slate-900">Synchronized</option>
            <option value="SUSPENDED" className="bg-slate-900">Intercepted</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
        </div>
        <Button variant="outline" className="h-14 rounded-2xl border-white/5 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest">
          Sync Registry
        </Button>
      </div>

      <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Merchant Entity</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Communication Link</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Application State</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Protocol Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse px-8 h-20"><td colSpan={4} className="bg-white/5" /></tr>
                ))
              ) : filteredShops.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <p className="text-white/20 text-xs font-black uppercase tracking-widest">Registry set empty</p>
                  </td>
                </tr>
              ) : (
                filteredShops.map((s) => (
                  <tr key={s.id} className="group hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-primary">
                          <Store className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{s.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">/{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-white/60">{s.email}</td>
                    <td className="px-8 py-6">
                      <Badge className={cn(
                        "text-[8px] font-black px-2.5 py-1 rounded-md border-none",
                        s.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                          s.status === "PENDING" ? "bg-primary/10 text-primary border border-primary/20" :
                            "bg-destructive/10 text-destructive"
                      )}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStatus(s.id, "APPROVED")}
                          disabled={s.status === "APPROVED"}
                          className="h-10 px-4 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-20"
                        >
                          Approve
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white rounded-2xl p-1 w-48">
                            <DropdownMenuItem onClick={() => updateStatus(s.id, "SUSPENDED")} className="rounded-xl h-10 px-3 cursor-pointer text-destructive focus:bg-destructive/10">
                              <Ban className="h-4 w-4 mr-3" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Intercept</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl h-10 px-3 cursor-pointer focus:bg-white/5">
                              <Mail className="h-4 w-4 mr-3" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Transmit Link</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
