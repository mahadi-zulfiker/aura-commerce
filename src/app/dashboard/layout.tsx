"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard, ShoppingBag, Settings, History, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

    const mobileNavItems = [
        { icon: LayoutDashboard, href: "/dashboard", label: "Home" },
        { icon: History, href: "/dashboard/orders", label: "Orders" },
        { icon: ShoppingBag, href: "/dashboard/products", label: "Shop", role: ["VENDOR", "ADMIN"] },
        { icon: Heart, href: "/dashboard/wishlist", label: "Saved" },
        { icon: Settings, href: "/dashboard/settings", label: "Profile" },
    ].filter(item => !item.role || item.role.includes(user?.role || "USER"));

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 min-h-screen sticky top-0 shrink-0">
                <SidebarNav />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
                <DashboardHeader />

                <main className="flex-1 overflow-y-auto scrollbar-thin px-4 py-8 md:px-10 pb-32 md:pb-10">
                    <div className="max-w-6xl mx-auto space-y-12 pb-20 md:pb-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>

                <DashboardFooter />

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 glass rounded-[2.5rem] flex items-center justify-around px-2 z-50 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 blur-xl -z-10" />
                    {mobileNavItems.slice(0, 5).map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-2xl transition-all duration-300",
                                    isActive ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" : "text-white/30"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "animate-bounce-slow" : "")} />
                                <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden">
            <aside className="hidden md:block w-72 border-r border-white/5 bg-slate-950 h-screen">
                <div className="p-8 space-y-8">
                    <Skeleton className="h-10 w-32 bg-white/5" />
                    <div className="space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />
                        ))}
                    </div>
                </div>
            </aside>
            <div className="flex-1 flex flex-col h-screen">
                <div className="h-20 border-b border-white/5 bg-slate-950/50" />
                <main className="flex-1 p-10 space-y-8">
                    <Skeleton className="h-10 w-48 bg-white/5" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full bg-white/5 rounded-[2rem]" />
                        ))}
                    </div>
                    <Skeleton className="h-96 w-full bg-white/5 rounded-[2.5rem]" />
                </main>
            </div>
        </div>
    );
}
