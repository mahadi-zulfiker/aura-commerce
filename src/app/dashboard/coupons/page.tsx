"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};

export default function CouponsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [search, setSearch] = useState("");
  const { data, refetch } = useQuery({
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
    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        await apiPatch(`/coupons/${editingCoupon.id}`, values);
        toast.success("Coupon updated");
      } else {
        await apiPost("/coupons", values);
        toast.success("Coupon created");
      }
      setEditingCoupon(null);
      reset({ status: "ACTIVE" });
      refetch();
    } catch (error: any) {
      toast.error("Failed to save coupon", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
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
  };

  const handleDeactivate = async (coupon: Coupon) => {
    const nextStatus = coupon.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await apiPatch(`/coupons/${coupon.id}`, { status: nextStatus });
      toast.success("Coupon updated");
      refetch();
    } catch (error: any) {
      toast.error("Unable to update coupon", {
        description: error.message || "Please try again.",
      });
    }
  };

  const handleDelete = async (couponId: string) => {
    try {
      await apiDelete(`/coupons/${couponId}`);
      toast.success("Coupon removed");
      refetch();
    } catch (error: any) {
      toast.error("Unable to delete coupon", {
        description: error.message || "Please try again.",
      });
    }
  };

  const coupons = data?.data ?? [];
  const filteredCoupons = useMemo(() => {
    if (!search) {
      return coupons;
    }
    return coupons.filter((coupon) => coupon.code.toLowerCase().includes(search.toLowerCase()));
  }, [coupons, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
        <p className="text-muted-foreground">Create and manage promotional codes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingCoupon ? "Edit coupon" : "Create coupon"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" {...register("code")} />
              {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="h-10 rounded-lg border border-border bg-muted/50 px-3 text-sm"
                {...register("type")}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed</option>
                <option value="FREE_SHIPPING">Free Shipping</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Value</Label>
              <Input id="value" type="number" {...register("value")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="h-10 rounded-lg border border-border bg-muted/50 px-3 text-sm"
                {...register("status")}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register("description")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minPurchase">Min purchase</Label>
              <Input id="minPurchase" type="number" {...register("minPurchase")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxDiscount">Max discount</Label>
              <Input id="maxDiscount" type="number" {...register("maxDiscount")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="usageLimit">Usage limit</Label>
              <Input id="usageLimit" type="number" {...register("usageLimit")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="usagePerUser">Usage per user</Label>
              <Input id="usagePerUser" type="number" {...register("usagePerUser")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
            <div className="flex items-end gap-3 md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingCoupon ? "Save changes" : "Create coupon"}
              </Button>
              {editingCoupon && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingCoupon(null);
                    reset({ status: "ACTIVE" });
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
          <CardTitle>Active coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search coupons"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {filteredCoupons.length === 0 ? (
            <p className="text-sm text-muted-foreground">No coupons found.</p>
          ) : (
            <div className="space-y-4">
              {filteredCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-lg p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{coupon.code}</p>
                      <Badge variant={coupon.status === "ACTIVE" ? "stock" : "outline"}>
                        {coupon.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {coupon.type} - {coupon.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeactivate(coupon)}>
                      {coupon.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(coupon.id)}>
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
