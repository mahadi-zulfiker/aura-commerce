"use client";

import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "@/store/auth";
import { apiGet } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/utils";

export default function AnalyticsPage() {
    const { user } = useAuthStore();
    const isAdmin = user?.role === "ADMIN";

    if (!isAdmin) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                Access denied. Admin only.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Detailed metrics and performance tracking.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <SalesChartCard />
                <TopProductsCard />
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
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                {isLoading ? (
                    <Skeleton className="h-[350px] w-full" />
                ) : (
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(5)}
                                    fontSize={12}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                    fontSize={12}
                                />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    formatter={(value: number) => [formatMoney(value), "Sales"]}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="currentColor"
                                    radius={[4, 4, 0, 0]}
                                    className="fill-primary"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function TopProductsCard() {
    const { data, isLoading } = useQuery({
        queryKey: ["analytics-top-products"],
        queryFn: () =>
            apiGet<
                {
                    id: string;
                    name: string;
                    soldCount: number;
                    images: { url: string }[];
                }[]
            >("/analytics/top-products"),
    });

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {data?.map((product) => (
                            <div key={product.id} className="flex items-center">
                                <div className="flex items-center gap-4 flex-1">
                                    {product.images[0] ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={product.images[0].url}
                                            alt={product.name}
                                            className="h-10 w-10 rounded-md object-cover bg-muted"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-md bg-muted" />
                                    )}
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none truncate w-[180px]">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {product.soldCount} sold
                                        </p>
                                    </div>
                                </div>
                                <div className="font-bold">#{product.soldCount}</div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
