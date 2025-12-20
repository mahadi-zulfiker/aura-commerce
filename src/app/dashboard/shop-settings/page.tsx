"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, apiGet, apiPatch } from "@/lib/api";
import { toast } from "sonner";

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
          toast.error("Session expired", {
            description: "Please log in again to manage your shop.",
          });
          router.replace("/auth/login");
          return;
        }
        toast.error("Unable to load shop profile", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    };

    loadShop();
  }, [reset, router]);

  const onSubmit = async (values: ShopForm) => {
    setIsSaving(true);
    try {
      await apiPatch("/shops/me/profile", values);
      toast.success("Shop updated");
    } catch (error: any) {
      toast.error("Update failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
        <p className="text-muted-foreground">Keep your storefront details up to date.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Shop name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register("website")} />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
