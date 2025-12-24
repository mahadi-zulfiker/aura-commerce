"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { imageBlurDataUrl } from "@/lib/placeholder";
import {
  Building2,
  Plus,
  Search,
  Edit3,
  Trash2,
  Globe,
  ImageIcon,
  Link as LinkIcon,
  MoreVertical,
  ChevronDown,
  Sparkles,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  isActive: boolean;
}

const brandSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  isActive: z.boolean().optional(),
});

type BrandForm = z.infer<typeof brandSchema>;

const normalize = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export default function BrandsPage() {
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [search, setSearch] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => apiGet<Brand[]>("/brands/admin/all"),
  });

  const brands = data ?? [];
  const filtered = useMemo(() => {
    if (!search) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
  }, [brands, search]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandForm>({
    resolver: zodResolver(brandSchema),
    defaultValues: { isActive: true },
  });

  const onSubmit = async (values: BrandForm) => {
    const payload = {
      name: values.name.trim(),
      slug: normalize(values.slug),
      logo: normalize(values.logo),
      description: normalize(values.description),
      website: normalize(values.website),
      isActive: values.isActive ?? true,
    };

    try {
      if (editingBrand) {
        await apiPatch(`/brands/${editingBrand.id}`, payload);
        toast.success("Entity identity updated");
      } else {
        await apiPost("/brands", payload);
        toast.success("New entity established");
      }
      setEditingBrand(null);
      reset({ isActive: true });
      refetch();
    } catch (error: any) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    reset({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo ?? "",
      description: brand.description ?? "",
      website: brand.website ?? "",
      isActive: brand.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (brandId: string) => {
    try {
      await apiDelete(`/brands/${brandId}`);
      toast.success("Entity purged");
      refetch();
    } catch (error: any) {
      toast.error("Purge failed");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Building2 className="h-3 w-3" />
            Entity Recognition Matrix
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Partner <span className="text-primary italic">Entities.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Manage global brand identities and corporate partner assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Creation Hub */}
        <div className="lg:col-span-12 xl:col-span-5">
          <div className="sticky top-28 p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">{editingBrand ? "Modify Entity" : "Establish Entity"}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Identity Definition Protocol</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Corporate Designation</Label>
                  <Input {...register("name")} placeholder="Aura Global" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-primary/50 transition-all placeholder:text-white/10" />
                  {errors.name && <p className="text-[10px] font-black text-destructive ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Visual Identity Asset (Logo URL)</Label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input {...register("logo")} className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Digital Domain (Website)</Label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input {...register("website")} className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Registry Visibility</span>
                  </div>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button type="submit" disabled={isSubmitting} className="h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  {editingBrand ? "Synchronize Identity" : "Commit Entity to Registry"}
                </Button>
                {editingBrand && (
                  <Button type="button" variant="ghost" className="h-14 rounded-2xl text-white/40 font-black uppercase tracking-widest text-[10px]" onClick={() => { setEditingBrand(null); reset({ isActive: true }); }}>
                    Abort Protocol
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Matrix */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Locate corporate identity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 bg-white/5 border-white/5 rounded-[1.5rem] pl-12 text-xs font-black uppercase tracking-widest focus:border-primary/50 transition-all placeholder:text-white/10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full py-20 text-center rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10">
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Zero entities detected</p>
              </div>
            ) : (
              filtered.map((b) => (
                <div key={b.id} className="group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 flex flex-col justify-between h-48">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 relative bg-white/5 flex items-center justify-center">
                        {b.logo ? (
                          <Image src={b.logo} alt={b.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <Building2 className="h-6 w-6 text-white/10" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-display font-black text-white group-hover:text-primary transition-colors">{b.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-0.5">/{b.slug}</p>
                      </div>
                    </div>
                    <Badge className={cn("h-5 px-2 text-[7px] font-black uppercase tracking-widest border-none", b.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/30")}>
                      {b.isActive ? "ESTABLISHED" : "HIDDEN"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-3.5 w-3.5 text-white/20" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30 truncate max-w-[120px]">
                        {b.website?.replace("https://", "").replace("www.", "") || "N/A"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(b)} className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-destructive hover:bg-destructive/10 transition-all">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
