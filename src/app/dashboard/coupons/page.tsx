"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Ticket,
  Plus,
  Search,
  Edit3,
  Trash2,
  Sparkles,
  Calendar,
  Percent,
  DollarSign,
  Truck,
  ChevronDown,
  Loader2,
  Lock,
  Zap,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  status: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  minPurchase?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usagePerUser?: number | null;
}

const couponSchema = z.object({
  code: z.string().min(3, "Code is required"),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.coerce.number().min(0),
  description: z.string().optional(),
  minPurchase: z.coerce.number().min(0).optional(),
  maxDiscount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(1).optional(),
  usagePerUser: z.coerce.number().min(1).optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]).optional(),
});

type CouponForm = z.infer<typeof couponSchema>;

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

export default function CouponsPage() {
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [search, setSearch] = useState("");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => apiGet<PaginatedResponse<Coupon>>("/coupons", { page: 1, limit: 50 }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CouponForm>({
    resolver: zodResolver(couponSchema),
    defaultValues: { status: "ACTIVE" },
  });

  const onSubmit = async (values: CouponForm) => {
    setIsSubmittingInternal(true);
    try {
      if (editingCoupon) {
        await apiPatch(`/coupons/${editingCoupon.id}`, values);
        toast.success("Incentive protocol synchronized");
      } else {
        await apiPost("/coupons", values);
        toast.success("New incentive token generated");
      }
      setEditingCoupon(null);
      reset({ status: "ACTIVE" });
      refetch();
    } catch (error: any) {
      toast.error("Protocol error");
    } finally {
      setIsSubmittingInternal(false);
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    reset({
      code: coupon.code,
      type: coupon.type as CouponForm["type"],
      value: coupon.value,
      description: coupon.description ?? "",
      minPurchase: coupon.minPurchase ?? undefined,
      maxDiscount: coupon.maxDiscount ?? undefined,
      usageLimit: coupon.usageLimit ?? undefined,
      usagePerUser: coupon.usagePerUser ?? undefined,
      startDate: formatDate(coupon.startDate),
      endDate: formatDate(coupon.endDate),
      status: coupon.status as CouponForm["status"],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (couponId: string) => {
    try {
      await apiDelete(`/coupons/${couponId}`);
      toast.success("Token purged from registry");
      refetch();
    } catch (error: any) {
      toast.error("Purge failed");
    }
  };

  const coupons = data?.data ?? [];
  const filteredCoupons = useMemo(() => {
    if (!search) return coupons;
    return coupons.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));
  }, [coupons, search]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Ticket className="h-3 w-3" />
            Incentive Engineering
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Growth <span className="text-primary italic">Incentives.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Configure high-conversion promotional tokens and discount protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Creation Node */}
        <div className="lg:col-span-12 xl:col-span-5">
          <div className="sticky top-28 p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">{editingCoupon ? "Modify Token" : "Generate Token"}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Incentive Parameters</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Unique Token Code</Label>
                  <Input {...register("code")} placeholder="AURA-BLACK-2024" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-black uppercase tracking-widest focus:border-primary/50 transition-all placeholder:text-white/10" />
                  {errors.code && <p className="text-[10px] font-black text-destructive ml-1">{errors.code.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Calculation Method</Label>
                    <div className="relative">
                      <select {...register("type")} className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all">
                        <option value="PERCENTAGE" className="bg-slate-900">Percentage</option>
                        <option value="FIXED_AMOUNT" className="bg-slate-900">Fixed Value</option>
                        <option value="FREE_SHIPPING" className="bg-slate-900">Zero Logistics</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Incentive Value</Label>
                    <Input {...register("value")} type="number" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-black focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Activation Date</Label>
                    <Input {...register("startDate")} type="date" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-xs font-bold text-white/40 focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Expiration Date</Label>
                    <Input {...register("endDate")} type="date" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-xs font-bold text-white/40 focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Operational State</Label>
                  <div className="relative">
                    <select {...register("status")} className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all">
                      <option value="ACTIVE" className="bg-slate-900">Synchronized (Active)</option>
                      <option value="INACTIVE" className="bg-slate-900">Paused (Inactive)</option>
                      <option value="EXPIRED" className="bg-slate-900">Legacy (Expired)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button type="submit" disabled={isSubmittingInternal} className="h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {isSubmittingInternal ? <Loader2 className="animate-spin h-4 w-4" /> : editingCoupon ? "Synchronize Incentive Node" : "Initialize Growth Token"}
                </Button>
                {editingCoupon && (
                  <Button type="button" variant="ghost" className="h-14 rounded-2xl text-white/40 font-black uppercase tracking-widest text-[10px]" onClick={() => { setEditingCoupon(null); reset({ status: "ACTIVE" }); }}>
                    Abort Protocol
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Token Registry */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Locate specific token code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 bg-white/5 border-white/5 rounded-[1.5rem] pl-12 text-xs font-black uppercase tracking-widest focus:border-primary/50 transition-all placeholder:text-white/10"
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 rounded-3xl bg-white/5 animate-pulse" />)
            ) : filteredCoupons.length === 0 ? (
              <div className="py-20 text-center rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10">
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Registry empty</p>
              </div>
            ) : (
              filteredCoupons.map((c) => (
                <div key={c.id} className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 overflow-hidden relative">
                  {/* Decorative Elements */}
                  <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                    <Tag className="h-24 w-24 rotate-12" />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-primary">
                        {c.type === "PERCENTAGE" ? <Percent className="h-6 w-6" /> : c.type === "FIXED_AMOUNT" ? <DollarSign className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-xl font-display font-black text-white tracking-widest">{c.code}</h4>
                          <Badge className={cn(
                            "text-[8px] font-black px-2 h-4 border-none",
                            c.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/30"
                          )}>
                            {c.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">
                          {c.type.replace("_", " ")} • Valued at {c.type === "PERCENTAGE" ? `${c.value}%` : `$${c.value}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
                      <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Operational Window</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-white/60 mt-0.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(c)} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all border border-white/5">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-destructive hover:bg-destructive/10 transition-all border border-white/5">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
