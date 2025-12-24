"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiDelete, apiPatch, apiPost } from "@/lib/api";
import { useAddresses } from "@/hooks/use-addresses";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Map,
  Phone,
  User,
  Globe,
  CreditCard,
  Trash2,
  Check,
  Loader2,
  Navigation,
  Sparkles,
  ArrowRight,
  Badge
} from "lucide-react";
import { cn } from "@/lib/utils";

const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(6, "Phone number is required"),
  street: z.string().min(4, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(3, "Zip code is required"),
  country: z.string().optional(),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { data, isLoading, refetch } = useAddresses();
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "Bangladesh" },
  });

  const onSubmit = async (values: AddressForm) => {
    setIsSubmittingInternal(true);
    try {
      await apiPost("/addresses", values);
      toast.success("Logistics node initialized");
      reset();
      setShowAddForm(false);
      refetch();
    } catch (error: any) {
      toast.error("Initialization failed");
    } finally {
      setIsSubmittingInternal(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await apiDelete(`/addresses/${id}`);
      toast.success("Node purged");
      refetch();
    } catch (error) {
      toast.error("Purge failed");
    }
  };

  const handleDefault = async (id: string) => {
    try {
      await apiPatch(`/addresses/${id}/default`, {});
      toast.success("Primary node re-assigned");
      refetch();
    } catch (error) {
      toast.error("Shadowing failed");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Navigation className="h-3 w-3" />
            Geospatial Node Matrix
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Delivery <span className="text-primary italic">Nodes.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Manage your verified geospatial coordinates for high-speed logistics.</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className={cn(
            "h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all px-8",
            showAddForm
              ? "bg-white/5 border border-white/10 text-white"
              : "bg-primary text-white shadow-primary/20 hover:scale-[1.05] active:scale-[0.95]"
          )}
        >
          {showAddForm ? "Return to Matrix" : <><Plus className="mr-2 h-4 w-4" /> Provision New Node</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {showAddForm ? (
          <div className="lg:col-span-12 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-white">Initialize Node</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Geospatial Data Entry</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Recipient Identity</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input {...register("fullName")} placeholder="John Maverick" className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all placeholder:text-white/10" />
                    </div>
                    {errors.fullName && <p className="text-[10px] font-black text-destructive ml-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Communication Link</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input {...register("phone")} placeholder="+1 234 567 890" className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Street Architecture</Label>
                  <div className="relative group">
                    <Map className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input {...register("street")} placeholder="742 Evergreen Terrace" className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">City Hub</Label>
                    <Input {...register("city")} placeholder="Neo Tokyo" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Zonal State</Label>
                    <Input {...register("state")} placeholder="Sector 7" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Zonal Protocol (Zip)</Label>
                    <Input {...register("zipCode")} placeholder="SHI-001" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Geopolitical Territory</Label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input {...register("country")} className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <Button type="submit" disabled={isSubmittingInternal} className="w-full h-16 rounded-3xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {isSubmittingInternal ? <Loader2 className="animate-spin h-5 w-5" /> : "Commit Geospatial Data"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 rounded-[2.5rem] bg-white/5 animate-pulse" />)
            ) : data?.length === 0 ? (
              <div className="col-span-full py-20 text-center rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10">
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Zero nodes detected</p>
              </div>
            ) : (
              data?.map((address) => (
                <div key={address.id} className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-white/40 group-hover:text-primary transition-colors">
                        <MapPin className="h-6 w-6" />
                      </div>
                      {address.isDefault && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1">
                          PRIMARY NODE
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-display font-black text-white">{address.fullName}</h4>
                      <p className="text-sm font-bold text-white/40 leading-relaxed">
                        {address.street}<br />
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 pt-2 flex items-center gap-2">
                        <Globe className="h-3 w-3" />
                        {address.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleDefault(address.id)}
                        className="flex-1 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(address.id)}
                      className="h-11 w-11 rounded-xl bg-destructive/10 hover:bg-destructive text-destructive hover:text-white flex items-center justify-center transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
