"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiGet } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/store";
import { useOrders } from "@/hooks/use-orders";

interface AdminUser {
  id: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const role = user?.role ?? "USER";

  const { data: ordersData } = useOrders(1, 5);
  const totalOrders = ordersData?.meta.total ?? 0;

  const { data: productsData } = useQuery({
    queryKey: ["dashboard-products", role],
    queryFn: () =>
      apiGet<PaginatedResponse<Product>>(role === "VENDOR" ? "/products/mine" : "/products", {
        page: 1,
        limit: 5,
      }),
    enabled: role !== "USER",
  });

  const { data: usersData } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: () => apiGet<PaginatedResponse<AdminUser>>("/users", { page: 1, limit: 5 }),
    enabled: role === "ADMIN",
  });

  const totalProducts = productsData?.meta.total ?? 0;
  const totalUsers = usersData?.meta.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your account activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All order activity</p>
          </CardContent>
        </Card>
        {role !== "USER" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active catalog items</p>
            </CardContent>
          </Card>
        )}
        {role === "ADMIN" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Total registered accounts</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">Revenue tracking coming soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center text-muted-foreground">
              Analytics coming soon
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your latest orders, customers, and inventory updates here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
