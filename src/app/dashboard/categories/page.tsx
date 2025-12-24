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
  Tag,
  Plus,
  Search,
  ChevronRight,
  Edit3,
  Trash2,
  Layers,
  ImageIcon,
  Hash,
  LayoutList,
  ChevronDown,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  parentId?: string | null;
  isActive: boolean;
  order: number;
}

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  order: z.coerce.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

const normalize = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => apiGet<Category[]>("/categories/admin/all"),
  });

  const categories = data ?? [];

  const filtered = useMemo(() => {
    if (!search) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { isActive: true, order: 0 },
  });

  const onSubmit = async (values: CategoryForm) => {
    const payload = {
      name: values.name.trim(),
      slug: normalize(values.slug),
      description: normalize(values.description),
      image: normalize(values.image),
      icon: normalize(values.icon),
      parentId: normalize(values.parentId),
      order: values.order ?? 0,
      isActive: values.isActive ?? true,
    };

    try {
      if (editingCategory) {
        await apiPatch(`/categories/${editingCategory.id}`, payload);
        toast.success("Taxonomy node updated");
      } else {
        await apiPost("/categories", payload);
        toast.success("New taxonomy node initialized");
      }
      setEditingCategory(null);
      reset({ isActive: true, order: 0 });
      refetch();
    } catch (error: any) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image: category.image ?? "",
      icon: category.icon ?? "",
      parentId: category.parentId ?? "",
      order: category.order ?? 0,
      isActive: category.isActive,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await apiDelete(`/categories/${categoryId}`);
      toast.success("Structural node purged");
      refetch();
    } catch (error: any) {
      toast.error("Purge operation failed");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Layers className="h-3 w-3" />
            Taxonomy Infrastructure
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Category <span className="text-primary italic">Architecture.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Structure your global catalog and control entity hierarchical relations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Editor Zone */}
        <div className="lg:col-span-12 xl:col-span-5">
          <div className="sticky top-28 p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Edit3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-white">{editingCategory ? "Update Node" : "Initialize Node"}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Taxonomy Protocol Input</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Entity Designation</Label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input {...register("name")} placeholder="Premium Apparel" className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all placeholder:text-white/10" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Symbolic Icon</Label>
                    <Input {...register("icon")} placeholder="shirt" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Priority Index</Label>
                    <Input {...register("order")} type="number" className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Parent Hierarchy</Label>
                  <div className="relative">
                    <select {...register("parentId")} className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all">
                      <option value="" className="bg-slate-900">Root Node</option>
                      {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Visual Asset Mapping (URL)</Label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input {...register("image")} className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Operational State</span>
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
                  {editingCategory ? "Synchronize Structural Node" : "Initialize Taxonomy Node"}
                </Button>
                {editingCategory && (
                  <Button type="button" variant="ghost" className="h-14 rounded-2xl text-white/40 font-black uppercase tracking-widest text-[10px]" onClick={() => { setEditingCategory(null); reset({ isActive: true, order: 0 }); }}>
                    Cancel Configuration
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Zone */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Identify structural node..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 bg-white/5 border-white/5 rounded-[1.5rem] pl-12 text-xs font-black uppercase tracking-widest focus:border-primary/50 transition-all placeholder:text-white/10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full py-20 text-center rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10">
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Zero structures detected</p>
              </div>
            ) : (
              filtered.map((c) => (
                <div key={c.id} className="group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 flex flex-col justify-between h-48">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                      {c.image ? (
                        <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 relative">
                          <Image src={c.image} alt={c.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                          <Tag className="h-6 w-6 text-white/20" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-base font-display font-black text-white group-hover:text-primary transition-colors">{c.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-0.5">/{c.slug}</p>
                      </div>
                    </div>
                    <Badge className={cn("h-5 px-2 text-[7px] font-black uppercase tracking-widest border-none", c.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-white/5 text-white/30")}>
                      {c.isActive ? "ALIVE" : "HIDDEN"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <LayoutList className="h-3.5 w-3.5 text-white/20" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Priority: {c.order}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(c)} className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-primary hover:bg-primary/10 transition-all">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-destructive hover:bg-destructive/10 transition-all">
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
