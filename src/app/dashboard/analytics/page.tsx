"use client";

import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useAuthStore } from "@/store/auth";
import { apiGet } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/utils";
import {
    BarChart3,
    TrendingUp,
    Package,
    Activity,
    Zap,
    Sparkles,
    Layers,
    ShieldAlert,
    ChevronRight,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";

    if (!isAdmin) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="p-4 rounded-3xl bg-destructive/10 border border-destructive/20 text-destructive">
                    <ShieldAlert className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-display font-black text-white italic">Access Restricted</h3>
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Admin Authorization Required</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
                        <Activity className="h-3 w-3" />
                        Core Pulse Matrix
                    </div>
                    <h1 className="text-4xl font-display font-black tracking-tight text-white">
                        Performance <span className="text-primary italic">Intelligence.</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-1">Deep-dive telemetry into global commerce velocity and asset liquidation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <SalesChartCard />
                </div>
                <div className="lg:col-span-4">
                    <TopProductsCard />
                </div>
            </div>
        </div>
    );
}

function SalesChartCard() {
    const { data, isLoading } = useQuery({
        queryKey: ["analytics-sales"],
        queryFn: () => apiGet<{ date: string; total: number }[]>("/analytics/sales"),
    });

    return (
        <div className="p-8 md:p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="h-32 w-32" />
            </div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">Revenue Stream</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Temporal Velocity Analysis</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Live Sync</span>
                </div>
            </div>

            <div className="h-[400px] w-full mt-6 pl-0 relative z-10">
                {isLoading ? (
                    <div className="h-full flex items-end gap-2 pb-8">
                        {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="flex-1 rounded-t-xl bg-white/5" style={{ height: `${Math.random() * 80 + 20}%` }} />)}
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => v.slice(5)}
                                fontSize={10}
                                fontStyle="italic"
                                fontWeight="bold"
                                stroke="rgba(255,255,255,0.2)"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(10, 10, 10, 0.95)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "16px",
                                    padding: "12px"
                                }}
                                cursor={{ fill: "white", opacity: 0.03 }}
                                labelStyle={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", marginBottom: "4px" }}
                                itemStyle={{ color: "white", fontSize: "14px", fontWeight: "900", fontFamily: "inherit" }}
                                formatter={(value: number) => [formatMoney(value), "NET REVENUE"]}
                            />
                            <Bar
                                dataKey="total"
                                radius={[12, 12, 4, 4]}
                            >
                                {data?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

function TopProductsCard() {
    const { data, isLoading } = useQuery({
        queryKey: ["analytics-top-products"],
        queryFn: () =>
            apiGet<{ id: string; name: string; soldCount: number; images: { url: string }[] }[]>("/analytics/top-products"),
    });

    return (
        <div className="p-8 md:p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-8 relative overflow-hidden group h-full">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 group-hover:text-primary transition-colors">
                    <Target className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">Top Entities</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Liquidation Leaders</p>
                </div>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-2 opacity-50">
                            <Skeleton className="h-12 w-12 rounded-xl bg-white/5" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-3 w-3/4 bg-white/5" />
                                <Skeleton className="h-2 w-1/4 bg-white/5" />
                            </div>
                        </div>
                    ))
                ) : (
                    data?.map((product, index) => (
                        <div key={product.id} className="flex items-center group/item hover:bg-white/[0.03] p-4 rounded-2xl transition-all border border-transparent hover:border-white/5">
                            <div className="relative flex items-center gap-5 flex-1 p-1">
                                <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden shrink-0">
                                    {product.images[0] ? (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover/item:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-white/10"><Package className="h-6 w-6" /></div>
                                    )}
                                    <div className="absolute top-1 left-1 h-5 w-5 rounded-lg bg-slate-950/80 backdrop-blur-md flex items-center justify-center border border-white/10">
                                        <span className="text-[8px] font-black text-primary">{index + 1}</span>
                                    </div>
                                </div>
                                <div className="grid gap-1.5 min-w-0">
                                    <p className="text-sm font-black text-white italic truncate pr-4 group-hover/item:text-primary transition-colors">
                                        {product.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-3 w-3 text-white/20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
                                            {product.soldCount} Units Liquidated
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/5 group-hover/item:bg-primary/10 transition-all border border-white/5 group-hover/item:border-primary/20">
                                <ChevronRight className="h-4 w-4 text-white/20 group-hover/item:text-primary transition-colors" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="pt-6 border-t border-white/5">
                <button className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Layers className="h-4 w-4" /> Full Spectrum Report
                </button>
            </div>
        </div>
    );
}
