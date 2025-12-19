"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { imageBlurDataUrl } from "@/lib/placeholder";

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
    if (!search) {
      return brands;
    }
    return brands.filter((brand) => brand.name.toLowerCase().includes(search.toLowerCase()));
  }, [brands, search]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
        toast.success("Brand updated");
      } else {
        await apiPost("/brands", payload);
        toast.success("Brand created");
      }
      setEditingBrand(null);
      reset({ isActive: true });
      refetch();
    } catch (error: any) {
      toast.error("Unable to save brand", {
        description: error.message || "Please try again.",
      });
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
  };

  const handleDelete = async (brandId: string) => {
    try {
      await apiDelete(`/brands/${brandId}`);
      toast.success("Brand deleted");
      refetch();
    } catch (error: any) {
      toast.error("Unable to delete brand", {
        description: error.message || "Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
        <p className="text-muted-foreground">Manage partner brands and assets.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingBrand ? "Edit brand" : "Create brand"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" {...register("logo")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register("website")} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
                )}
              />
              <span className="text-sm text-muted-foreground">Visible in storefront</span>
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Button type="submit">{editingBrand ? "Save changes" : "Create brand"}</Button>
              {editingBrand && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingBrand(null);
                    reset({ isActive: true });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search brands"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No brands found.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((brand) => (
                <div
                  key={brand.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    {brand.logo ? (
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-muted/30">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={imageBlurDataUrl}
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-lg bg-muted/50" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{brand.name}</p>
                        <Badge variant={brand.isActive ? "stock" : "outline"}>
                          {brand.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">/{brand.slug}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(brand)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(brand.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
