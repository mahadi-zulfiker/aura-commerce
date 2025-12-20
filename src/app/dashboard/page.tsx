"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Store, Package, Users, Bell } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiGet } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/store";
import { useOrders } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminUser {
  id: string;
}

interface AdminShop {
  id: string;
  name: string;
  email: string;
  status: string;
}

const toMoney = (value: number) => `$${value.toFixed(2)}`;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const role = user?.role ?? "USER";

  const { data: ordersData, isLoading: isOrdersLoading } = useOrders(1, 30);
  const orders = ordersData?.data ?? [];
  const totalOrders = ordersData?.meta.total ?? 0;

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["dashboard-products", role],
    queryFn: () =>
      apiGet<PaginatedResponse<Product>>(role === "VENDOR" ? "/products/mine" : "/products", {
        page: 1,
        limit: 30,
      }),
    enabled: role !== "USER",
  });

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: () => apiGet<PaginatedResponse<AdminUser>>("/users", { page: 1, limit: 30 }),
    enabled: role === "ADMIN",
  });

  const { data: shopsData, isLoading: isShopsLoading } = useQuery({
    queryKey: ["dashboard-shops"],
    queryFn: () => apiGet<PaginatedResponse<AdminShop>>("/shops/admin/all", { page: 1, limit: 30 }),
    enabled: role === "ADMIN",
  });

  const totalProducts = productsData?.meta.total ?? 0;
  const totalUsers = usersData?.meta.total ?? 0;
  const totalShops = shopsData?.meta.total ?? 0;

  const revenue = useMemo(() => {
    return orders
      .filter((order) => order.paymentStatus === "PAID")
      .reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.orderStatus === "PENDING" || order.orderStatus === "PROCESSING").length,
    [orders],
  );

  const failedPayments = useMemo(
    () => orders.filter((order) => order.paymentStatus === "FAILED").length,
    [orders],
  );

  const lowStockCount = useMemo(() => {
    const items = productsData?.data ?? [];
    return items.filter((product) => product.stockCount <= 5).length;
  }, [productsData?.data]);

  const pendingShops = useMemo(() => {
    const items = shopsData?.data ?? [];
    return items.filter((shop) => shop.status === "PENDING").length;
  }, [shopsData?.data]);

  const trend = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - idx));
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        total: 0,
      };
    });

    orders.forEach((order) => {
      if (order.paymentStatus !== "PAID") {
        return;
      }
      const key = order.createdAt?.slice(0, 10);
      const bucket = days.find((day) => day.key === key);
      if (bucket) {
        bucket.total += order.total;
      }
    });

    return days;
  }, [orders]);

  const maxTrend = Math.max(...trend.map((item) => item.total), 1);

  const notifications = [
    {
      label: "Pending orders",
      value: pendingOrders,
      tone: "warning",
      description: "Orders waiting for fulfillment action.",
      show: role !== "USER",
    },
    {
      label: "Failed payments",
      value: failedPayments,
      tone: "danger",
      description: "Reach out or retry payment collection.",
      show: role !== "USER",
    },
    {
      label: "Low stock",
      value: lowStockCount,
      tone: "info",
      description: "Products below 5 units in stock.",
      show: role !== "USER",
    },
    {
      label: "Pending vendors",
      value: pendingShops,
      tone: "warning",
      description: "Shop applications awaiting approval.",
      show: role === "ADMIN",
    },
  ].filter((item) => item.show);

  const lastOrderDate = orders[0]?.createdAt
    ? new Date(orders[0].createdAt).toLocaleDateString()
    : "-";

  const summaryCards =
    role === "USER"
      ? [
          {
            title: "Orders",
            value: totalOrders,
            icon: CreditCard,
            helper: "Your recent activity",
          },
          {
            title: "Total spent",
            value: toMoney(revenue),
            icon: DollarSign,
            helper: "Paid orders only",
          },
          {
            title: "In progress",
            value: pendingOrders,
            icon: Activity,
            helper: "Orders in flight",
          },
          {
            title: "Last order",
            value: lastOrderDate,
            icon: Users,
            helper: "Latest purchase date",
          },
        ]
      : [
          {
            title: "Orders",
            value: totalOrders,
            icon: CreditCard,
            helper: "All order activity",
          },
          {
            title: "Revenue",
            value: toMoney(revenue),
            icon: DollarSign,
            helper: "Paid orders only",
          },
          {
            title: "Products",
            value: totalProducts,
            icon: Package,
            helper: "Active catalog items",
          },
          role === "ADMIN"
            ? {
                title: "Vendors",
                value: totalShops,
                icon: Store,
                helper: "Registered storefronts",
              }
            : {
                title: "Low stock",
                value: lowStockCount,
                icon: Activity,
                helper: "Items to restock",
              },
        ];

  const isDashboardLoading =
    isOrdersLoading ||
    (role !== "USER" && isProductsLoading) ||
    (role === "ADMIN" && (isUsersLoading || isShopsLoading));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your account activity.</p>
      </div>

      {isDashboardLoading ? (
        <DashboardContentSkeleton />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.helper}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-40">
                  {trend.map((item) => (
                    <div key={item.key} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className="w-full rounded-lg bg-primary/80"
                        style={{ height: `${Math.max(8, (item.total / maxTrend) * 100)}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Showing paid order revenue for the last 7 days.
                </p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No alerts right now.</p>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((item) => (
                      <div key={item.label} className="rounded-lg border border-border/60 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{item.label}</p>
                          <Badge variant="outline">{item.value}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function DashboardContentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-3 w-48 mt-4" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
