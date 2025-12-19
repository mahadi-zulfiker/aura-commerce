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
    if (!search) {
      return categories;
    }
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categories, search]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
        toast.success("Category updated");
      } else {
        await apiPost("/categories", payload);
        toast.success("Category created");
      }
      setEditingCategory(null);
      reset({ isActive: true, order: 0 });
      refetch();
    } catch (error: any) {
      toast.error("Unable to save category", {
        description: error.message || "Please try again.",
      });
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
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await apiDelete(`/categories/${categoryId}`);
      toast.success("Category deleted");
      refetch();
    } catch (error: any) {
      toast.error("Unable to delete category", {
        description: error.message || "Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Structure your catalog and control visibility.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingCategory ? "Edit category" : "Create category"}</CardTitle>
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
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" {...register("image")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" {...register("icon")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parentId">Parent category</Label>
              <select
                id="parentId"
                className="h-10 rounded-lg border border-border bg-muted/50 px-3 text-sm"
                {...register("parentId")}
              >
                <option value="">None</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" {...register("order")} />
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch checked={Boolean(field.value)} onCheckedChange={field.onChange} />
                )}
              />
              <span className="text-sm text-muted-foreground">Active in storefront</span>
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Button type="submit">{editingCategory ? "Save changes" : "Create category"}</Button>
              {editingCategory && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingCategory(null);
                    reset({ isActive: true, order: 0 });
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
          <CardTitle>All categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search categories"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories found.</p>
          ) : (
            <div className="space-y-4">
              {filtered.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    {category.image ? (
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                        <Image
                          src={category.image}
                          alt={category.name}
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
                        <p className="font-medium">{category.name}</p>
                        <Badge variant={category.isActive ? "stock" : "outline"}>
                          {category.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">/{category.slug}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
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
