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
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  Mail,
  Shield,
  UserPlus,
  Trash2,
  Ban,
  CheckCircle,
  UserCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["users", page, roleFilter, statusFilter],
    queryFn: () =>
      apiGet<PaginatedResponse<AdminUser>>("/users", {
        page,
        limit: 20,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      }),
  });

  const users = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, users]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiPatch(`/users/${id}/status`, { status });
      toast.success(`Identity protocol updated to ${status}`);
      refetch();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Users className="h-3 w-3" />
            Identity Matrix
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            User <span className="text-primary italic">Intelligence.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Manage global access levels and node authentication.</p>
        </div>
        <Button className="h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all px-8">
          <UserPlus className="mr-2 h-4 w-4" /> Provision New Node
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Identify by email or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-xs font-black uppercase tracking-widest focus:border-primary/50 transition-all placeholder:text-white/10"
          />
        </div>
        <div className="md:col-span-3">
          <select
            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="" className="bg-slate-950">All Classifications</option>
            <option value="USER" className="bg-slate-950">Standard User</option>
            <option value="VENDOR" className="bg-slate-950">Approved Merchant</option>
            <option value="ADMIN" className="bg-slate-950">System Architect</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select
            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="" className="bg-slate-950">All States</option>
            <option value="ACTIVE" className="bg-slate-950">Synchronized</option>
            <option value="SUSPENDED" className="bg-slate-950">Intercepted</option>
            <option value="PENDING" className="bg-slate-950">Awaiting Auth</option>
          </select>
        </div>
      </div>

      <div className="rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Intelligence Node</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Classification</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Operational State</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-10 w-48 bg-white/5 rounded-xl" /></td>
                    <td className="px-8 py-6"><div className="h-6 w-24 bg-white/5 rounded-lg" /></td>
                    <td className="px-8 py-6"><div className="h-6 w-24 bg-white/5 rounded-lg" /></td>
                    <td className="px-8 py-6"><div className="h-8 w-8 bg-white/5 rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-white/20 text-xs font-black uppercase tracking-widest">Zero nodes detected</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-[1.25rem] bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center text-primary font-display font-black border border-primary/10">
                          {u.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {u.role === "ADMIN" ? <Shield className="h-3 w-3 text-accent" /> : u.role === "VENDOR" ? <ShieldCheck className="h-3 w-3 text-primary" /> : <ShieldAlert className="h-3 w-3 text-white/20" />}
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{u.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border-none",
                        u.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                      )}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white rounded-2xl p-1 w-48">
                          {u.status === "ACTIVE" ? (
                            <DropdownMenuItem onClick={() => updateStatus(u.id, "SUSPENDED")} className="rounded-xl h-10 px-3 cursor-pointer text-destructive focus:bg-destructive/10">
                              <Ban className="h-4 w-4 mr-3" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Intercept Node</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => updateStatus(u.id, "ACTIVE")} className="rounded-xl h-10 px-3 cursor-pointer text-emerald-500 focus:bg-emerald-500/10">
                              <CheckCircle className="h-4 w-4 mr-3" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Restore Node</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="rounded-xl h-10 px-3 cursor-pointer text-white/40 focus:bg-white/5">
                            <Mail className="h-4 w-4 mr-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Send Transmission</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl h-10 px-3 cursor-pointer text-destructive focus:bg-destructive/10">
                            <Trash2 className="h-4 w-4 mr-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Terminal Purge</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
