"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiGet, apiPatch } from "@/lib/api";
import { toast } from "sonner";
import type { StoreSettings } from "@/types/api";

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
        toast.error("Unable to load settings", {
          description: error.message || "Please try again.",
        });
      }
    };

    loadSettings();
  }, [reset]);

  const onSubmit = async (values: SettingsForm) => {
    setIsSaving(true);
    try {
      await apiPatch("/settings", values);
      toast.success("Settings updated");
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
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground">
          Configure shipping thresholds, tax rate, and return policy defaults.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commerce configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="shippingThreshold">Free shipping threshold</Label>
                <Input
                  id="shippingThreshold"
                  type="number"
                  step="0.01"
                  {...register("shippingThreshold")}
                />
                {errors.shippingThreshold && (
                  <p className="text-xs text-red-500">{errors.shippingThreshold.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="baseShippingCost">Base shipping cost</Label>
                <Input
                  id="baseShippingCost"
                  type="number"
                  step="0.01"
                  {...register("baseShippingCost")}
                />
                {errors.baseShippingCost && (
                  <p className="text-xs text-red-500">{errors.baseShippingCost.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="taxRate">Tax rate (decimal)</Label>
                <Input id="taxRate" type="number" step="0.001" {...register("taxRate")} />
                {errors.taxRate && (
                  <p className="text-xs text-red-500">{errors.taxRate.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Example: 0.075 for 7.5%</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="returnWindowDays">Return window (days)</Label>
                <Input id="returnWindowDays" type="number" {...register("returnWindowDays")} />
                {errors.returnWindowDays && (
                  <p className="text-xs text-red-500">{errors.returnWindowDays.message}</p>
                )}
              </div>
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
