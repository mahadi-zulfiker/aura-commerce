"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, apiGet, apiPatch } from "@/lib/api";
import { toast } from "sonner";
import {
  Store,
  Mail,
  Phone,
  Globe,
  Settings2,
  Sparkles,
  CheckCircle2,
  Loader2,
  FileText,
  Smartphone,
  LayoutDashboard,
  Badge
} from "lucide-react";
import { cn } from "@/lib/utils";

const shopSchema = z.object({
  name: z.string().min(2, "Shop name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Phone is required"),
  description: z.string().optional(),
  website: z.string().optional(),
});

type ShopForm = z.infer<typeof shopSchema>;

export default function ShopSettingsPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShopForm>({
    resolver: zodResolver(shopSchema),
  });

  useEffect(() => {
    const loadShop = async () => {
      try {
        const data = await apiGet<ShopForm>("/shops/me/profile");
        reset({
          name: data.name,
          email: data.email,
          phone: data.phone,
          description: data.description ?? "",
          website: data.website ?? "",
        });
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          toast.error("Session expired");
          router.replace("/auth/login");
          return;
        }
        toast.error("Critical failure during profile acquisition");
      }
    };

    loadShop();
  }, [reset, router]);

  const onSubmit = async (values: ShopForm) => {
    setIsSaving(true);
    try {
      await apiPatch("/shops/me/profile", values);
      toast.success("Merchant telemetry synchronized");
    } catch (error: any) {
      toast.error("Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Store className="h-3 w-3" />
            Merchant Protocol Hub
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Shop <span className="text-primary italic">Engine.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Configure your specialized storefront parameters and operational identity.</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-10">
        <div className="flex-1 max-w-3xl">
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-[1.5rem] bg-primary/10 border border-primary/20">
                <Settings2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-black text-white italic">Store Profile</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Merchant Identity Settings</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Display Designation (Shop Name)</Label>
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input {...register("name")} placeholder="Aura High-Dynamics" className="h-16 bg-white/5 border-white/5 rounded-2xl pl-12 text-base font-bold focus:border-primary/50 transition-all placeholder:text-white/10" />
                  </div>
                  {errors.name && <p className="text-[10px] font-black text-destructive ml-2">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Primary Contact Protocol (Email)</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input {...register("email")} placeholder="hq@aura.io" className="h-16 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all placeholder:text-white/10" />
                    </div>
                    {errors.email && <p className="text-[10px] font-black text-destructive ml-2">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Communication Link (Phone)</Label>
                    <div className="relative group">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input {...register("phone")} placeholder="+1 000 AURA 01" className="h-16 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                    </div>
                    {errors.phone && <p className="text-[10px] font-black text-destructive ml-2">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Brand Philosophy (Description)</Label>
                  <div className="relative group">
                    <FileText className="absolute left-4 top-6 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <textarea
                      {...register("description")}
                      className="w-full h-32 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 pt-5 text-sm font-medium focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/10"
                      placeholder="Define your merchant mission and operational values..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Corporate Domain (Website)</Label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input {...register("website")} placeholder="https://aura.io" className="h-16 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button type="submit" disabled={isSaving} className="h-16 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all px-12 group">
                  {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : <><CheckCircle2 className="mr-3 h-5 w-5 text-primary group-hover:scale-110 transition-transform" /> Commit Changes</>}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="xl:w-80 space-y-6">
          <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h4 className="text-sm font-display font-black text-white uppercase tracking-widest">Merchant Status</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-4">
                <span className="text-white/30">Registry State</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-2 rounded-md">Verified</Badge>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-4">
                <span className="text-white/30">Tier Classification</span>
                <span className="text-white">Enterprise</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/30">Operational Pulse</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-500">Live</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full h-14 rounded-2xl border-white/5 bg-white/5 text-white/40 hover:text-white flex items-center gap-3 group">
            <LayoutDashboard className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest">View Public Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
