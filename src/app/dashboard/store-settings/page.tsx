"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPatch } from "@/lib/api";
import { toast } from "sonner";
import type { StoreSettings } from "@/types/api";
import {
  Settings2,
  Truck,
  DollarSign,
  Percent,
  Calendar,
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSchema = z.object({
  shippingThreshold: z.coerce.number().min(0, "Threshold must be 0 or higher"),
  baseShippingCost: z.coerce.number().min(0, "Shipping cost must be 0 or higher"),
  taxRate: z.coerce.number().min(0, "Tax rate must be 0 or higher"),
  returnWindowDays: z.coerce.number().min(1, "Return window must be at least 1 day"),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function StoreSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await apiGet<StoreSettings>("/settings");
        reset({
          shippingThreshold: data.shippingThreshold,
          baseShippingCost: data.baseShippingCost,
          taxRate: data.taxRate,
          returnWindowDays: data.returnWindowDays,
        });
      } catch (error: any) {
        toast.error("Telemetry acquisition failure");
      }
    };

    loadSettings();
  }, [reset]);

  const onSubmit = async (values: SettingsForm) => {
    setIsSaving(true);
    try {
      await apiPatch("/settings", values);
      toast.success("Commerce protocols synchronized");
    } catch (error: any) {
      toast.error("Protocol update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Settings2 className="h-3 w-3" />
            Global Framework Config
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            System <span className="text-primary italic">Architecture.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Configure high-level commerce protocols, fiscal parameters, and logistical rules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-8">
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-[1.5rem] bg-primary/10 border border-primary/20">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-wider">Commerce Protocols</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Fiscal & Logistical Definition</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Logistics Zero-Point (Free Shipping Threshold)</Label>
                  <div className="relative group">
                    <Truck className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input type="number" step="0.01" {...register("shippingThreshold")} className="h-16 bg-white/5 border-white/5 rounded-2xl pl-12 pr-6 text-base font-bold focus:border-primary/50 transition-all" />
                  </div>
                  {errors.shippingThreshold && <p className="text-[10px] font-black text-destructive ml-2">{errors.shippingThreshold.message}</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Base Logistical Rate (Shipping Cost)</Label>
                  <div className="relative group">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input type="number" step="0.01" {...register("baseShippingCost")} className="h-16 bg-white/5 border-white/5 rounded-2xl pl-12 pr-6 text-base font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Fiscal Coefficient (Tax Rate)</Label>
                  <div className="relative group">
                    <Percent className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input type="number" step="0.001" {...register("taxRate")} className="h-16 bg-white/5 border-white/5 rounded-2xl pl-12 pr-6 text-base font-bold focus:border-primary/50 transition-all" />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2 italic">Example: 0.15 for 15% VAT/Tax</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Return Sync Window (Days)</Label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input type="number" {...register("returnWindowDays")} className="h-16 bg-white/5 border-white/5 rounded-2xl pl-12 pr-6 text-base font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <Button type="submit" disabled={isSaving} className="h-16 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all px-12 group">
                  {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <><CheckCircle2 className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" /> Synchronize Framework</>}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert className="h-24 w-24" />
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="text-sm font-display font-black text-white uppercase tracking-widest">Protocol Warning</h4>
            </div>

            <p className="text-xs font-medium text-white/40 leading-relaxed relative z-10">
              Changes to these parameters will immediately affect global checkout calculations, financial reporting, and automated logistic triggers. Committing these updates requires high-level clearance.
            </p>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-primary">Active Framework</span>
              </div>
              <p className="text-[10px] font-bold text-white/60">Aura Core v2.4.0 High-Dynamics Engine</p>
            </div>
          </div>

          <Button variant="outline" className="w-full h-14 rounded-2xl border-white/5 bg-white/5 text-white/40 hover:text-white flex items-center gap-3 transition-all group">
            <LayoutDashboard className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest">Audit Framework Logs</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
