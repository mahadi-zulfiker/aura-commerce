"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CreditCard,
  DollarSign,
  Store,
  Package,
  Users,
  Bell,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  ShoppingBag,
  Heart
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiGet } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/store";
import { useOrders } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const toMoney = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const role = user?.role ?? "USER";

  const { data: ordersData, isLoading: isOrdersLoading } = useOrders(1, 100);
  const orders = ordersData?.data ?? [];
  const totalOrdersCount = ordersData?.meta.total ?? 0;

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["dashboard-products", role],
    queryFn: () =>
      apiGet<PaginatedResponse<Product>>(role === "VENDOR" ? "/products/mine" : "/products", {
        page: 1,
        limit: 100,
      }),
    enabled: role !== "USER",
  });

  const { data: shopsData, isLoading: isShopsLoading } = useQuery({
    queryKey: ["dashboard-shops"],
    queryFn: () => apiGet<PaginatedResponse<any>>("/shops/admin/all", { page: 1, limit: 100 }),
    enabled: role === "ADMIN",
  });

  const totalProducts = productsData?.meta.total ?? 0;
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

  const lowStockCount = useMemo(() => {
    const items = productsData?.data ?? [];
    return items.filter((product) => product.stockCount <= 5).length;
  }, [productsData?.data]);

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
      if (order.paymentStatus !== "PAID") return;
      const key = order.createdAt?.slice(0, 10);
      const bucket = days.find((day) => day.key === key);
      if (bucket) bucket.total += order.total;
    });

    return days;
  }, [orders]);

  const maxTrend = Math.max(...trend.map((item) => item.total), 1);

  const summaryCards =
    role === "USER"
      ? [
        { title: "Total Orders", value: totalOrdersCount, icon: CreditCard, trend: "+12%", color: "text-primary", bg: "bg-primary/10" },
        { title: "Total Spent", value: toMoney(revenue), icon: DollarSign, trend: "+8.2%", color: "text-accent", bg: "bg-accent/10" },
        { title: "Active Shipments", value: pendingOrders, icon: Zap, trend: "Stable", color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Saved Items", value: "15", icon: Heart, trend: "+2", color: "text-pink-500", bg: "bg-pink-500/10" },
      ]
      : [
        { title: "Gross Revenue", value: toMoney(revenue), icon: DollarSign, trend: "+24%", color: "text-accent", bg: "bg-accent/10" },
        { title: "Orders Processed", value: totalOrdersCount, icon: CreditCard, trend: "+15%", color: "text-primary", bg: "bg-primary/10" },
        { title: "Catalog Size", value: totalProducts, icon: Package, trend: "+3", color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: role === "ADMIN" ? "Active Vendors" : "Low Stock Items", value: role === "ADMIN" ? totalShops : lowStockCount, icon: role === "ADMIN" ? Store : Activity, trend: "-2", color: "text-orange-500", bg: "bg-orange-500/10" },
      ];

  const isDashboardLoading = isOrdersLoading || (role !== "USER" && isProductsLoading) || (role === "ADMIN" && isShopsLoading);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <TrendingUp className="h-3 w-3" />
            Performance Insight
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Hello, <span className="text-primary italic">{user?.firstName || "Aura User"}.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Here's a strategic overview of your workspace telemetry.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] transition-all px-6">
            Export Data
          </Button>
          <Button className="h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all px-6">
            New Command
          </Button>
        </div>
      </div>

      {isDashboardLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, i) => (
              <div
                key={card.title}
                className="group relative h-36 rounded-[2.5rem] bg-white/[0.03] border border-white/5 p-6 overflow-hidden transition-all duration-500 hover:bg-white/[0.06] hover:border-white/10"
              >
                <div className={cn("absolute top-6 right-6 p-3 rounded-2xl", card.bg)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{card.title}</p>
                    <h3 className="text-2xl font-display font-black text-white mt-1">{card.value}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 pt-2">
                    <div className={cn("p-0.5 rounded-full", card.trend.startsWith("+") ? "bg-emerald-500/20" : "bg-white/10")}>
                      {card.trend.startsWith("+") ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <TrendingUp className="h-3 w-3 text-white/30" />}
                    </div>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", card.trend.startsWith("+") ? "text-emerald-500" : "text-white/30")}>
                      {card.trend} this month
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 group rounded-[2.5rem] bg-white/[0.03] border border-white/5 p-8 transition-all duration-500 hover:border-white/10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-accent/10">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-black text-white tracking-tight">Revenue Dynamics</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Last 7 cycles of operation</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Live Telemetry</span>
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-4 h-56 relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                  {[1, 2, 3, 4].map(line => <div key={line} className="w-full h-px bg-white" />)}
                </div>

                {trend.map((item, idx) => {
                  const height = (item.total / maxTrend) * 100;
                  return (
                    <div key={item.key} className="relative flex flex-col items-center gap-4 flex-1 h-full justify-end group/bar">
                      <div
                        className="w-full relative rounded-2xl transition-all duration-700 delay-[idx*100ms] group-hover/bar:brightness-125"
                        style={{
                          height: `${Math.max(8, height)}%`,
                          background: `linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-glow)))`,
                          opacity: 0.1 + (height / 120),
                          boxShadow: height > 50 ? '0 10px 30px -5px hsl(var(--primary) / 0.3)' : 'none'
                        }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-[10px] font-black uppercase tracking-widest z-10">
                          {toMoney(item.total)}
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white/20 group-hover/bar:text-primary transition-colors">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 rounded-[2.5rem] bg-white/[0.03] border border-white/5 p-8 flex flex-col transition-all duration-500 hover:border-white/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-black text-white tracking-tight">Active Pulse</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">System state notifications</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {orders.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-3xl">
                    <p className="text-xs font-black uppercase tracking-widest text-white/20">No active events</p>
                  </div>
                ) : (
                  orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="group flex items-center justify-between p-4 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-white/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white">{order.orderNumber.slice(-8)}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{new Date(order.createdAt!).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{toMoney(order.total)}</p>
                        <Badge className="text-[7px] font-black px-2 h-4 rounded-md uppercase tracking-[0.2em] bg-primary/10 text-primary border-none">
                          {order.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Button variant="ghost" className="w-full mt-6 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/5 transition-all">
                View System Logs
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 rounded-[2.5rem] bg-white/5 border border-white/5" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-80 rounded-[2.5rem] bg-white/5 border border-white/5" />
        <div className="lg:col-span-4 h-80 rounded-[2.5rem] bg-white/5 border border-white/5" />
      </div>
    </div>
  );
}
