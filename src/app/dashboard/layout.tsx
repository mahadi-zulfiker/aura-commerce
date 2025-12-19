"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Mobile Sidebar Trigger */}
            <div className="md:hidden border-b p-4 flex items-center">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[240px]">
                        <SidebarNav />
                    </SheetContent>
                </Sheet>
                <span className="ml-4 font-semibold">Dashboard</span>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 mt-16 pb-16">
                <SidebarNav className="border-r" />
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-64 py-8 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
