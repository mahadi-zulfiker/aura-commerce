"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(useAuthStore.persist.hasHydrated());
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
            setHasHydrated(true);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        setMounted(true);
        if (!hasHydrated) {
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
    }, [hasHydrated, isAuthenticated, router, pathname, user?.role]);

    if (!mounted || !hasHydrated) {
        return null; // or a loading spinner
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
