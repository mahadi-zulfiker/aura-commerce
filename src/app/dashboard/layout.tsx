"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user, hasHydrated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !hasHydrated) {
            return;
        }
        if (!isAuthenticated) {
            // Simple client-side protection
            // Ideally should be middleware or server component check
            router.replace("/auth/login");
        }
        const role = user?.role ?? "USER";
        const adminOnly = [
            "/dashboard/users",
            "/dashboard/vendors",
            "/dashboard/all-products",
            "/dashboard/all-orders",
            "/dashboard/coupons",
            "/dashboard/categories",
            "/dashboard/brands",
            "/dashboard/store-settings",
        ];
        const vendorOnly = [
            "/dashboard/products",
            "/dashboard/vendor-orders",
            "/dashboard/shop-settings",
        ];

        if (adminOnly.includes(pathname) && role !== "ADMIN") {
            router.push("/dashboard");
        }
        if (vendorOnly.includes(pathname) && role !== "VENDOR") {
            router.push("/dashboard");
        }
    }, [hasHydrated, isAuthenticated, mounted, router, pathname, user?.role]);

    if (!mounted || !hasHydrated) {
        return <DashboardSkeleton />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <DashboardHeader />
            <div className="flex">
                <aside className="hidden md:block w-64 border-r border-border/60 bg-background/80 backdrop-blur sticky top-16 h-[calc(100vh-4rem)]">
                    <SidebarNav className="border-r-0 bg-transparent" />
                </aside>
                <section className="flex-1 px-4 py-8 md:px-10">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </section>
            </div>
            <DashboardFooter />
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="h-16 border-b border-border/60 bg-background/80" />
            <div className="flex">
                <aside className="hidden md:block w-64 border-r border-border/60 bg-background/80 h-[calc(100vh-4rem)]">
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </aside>
                <section className="flex-1 px-4 py-8 md:px-10">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <Skeleton className="h-8 w-48" />
                        <div className="grid gap-4 md:grid-cols-2">
                            <Skeleton className="h-28 w-full" />
                            <Skeleton className="h-28 w-full" />
                        </div>
                        <Skeleton className="h-64 w-full" />
                    </div>
                </section>
            </div>
        </div>
    );
}
