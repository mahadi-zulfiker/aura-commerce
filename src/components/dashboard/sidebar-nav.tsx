"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/auth";
import { logoutUser } from "@/lib/api";
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    Users,
    Package,
    CreditCard,
    LogOut,
    Store,
    Heart,
    History,
    Tag,
    BadgeCheck,
    RotateCcw,
    SlidersHorizontal,
    BarChart,
    Bell,
    ChevronRight,
    Sparkles,
    ArrowLeft
} from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SidebarNav({ className, ...props }: SidebarNavProps) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);

    const role = user?.role || "USER";

    const commonItems = [
        {
            title: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ];

    const userItems = [
        { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { title: "Orders", href: "/dashboard/orders", icon: History },
        { title: "Returns", href: "/dashboard/returns", icon: RotateCcw },
        { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
        { title: "Addresses", href: "/dashboard/addresses", icon: Users },
    ];

    const vendorItems = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Products", href: "/dashboard/products", icon: Package },
        { title: "Orders", href: "/dashboard/vendor-orders", icon: ShoppingBag },
        { title: "Returns", href: "/dashboard/returns", icon: RotateCcw },
        { title: "Shop Settings", href: "/dashboard/shop-settings", icon: Store },
    ];

    const adminItems = [
        { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { title: "Analytics", href: "/dashboard/analytics", icon: BarChart },
        { title: "Users", href: "/dashboard/users", icon: Users },
        { title: "Vendors", href: "/dashboard/vendors", icon: Store },
        { title: "Categories", href: "/dashboard/categories", icon: Tag },
        { title: "Brands", href: "/dashboard/brands", icon: BadgeCheck },
        { title: "Products", href: "/dashboard/all-products", icon: Package },
        { title: "Orders", href: "/dashboard/all-orders", icon: ShoppingBag },
        { title: "Returns", href: "/dashboard/returns", icon: RotateCcw },
        { title: "Coupons", href: "/dashboard/coupons", icon: CreditCard },
        { title: "Store Settings", href: "/dashboard/store-settings", icon: SlidersHorizontal },
    ];

    const items = role === "ADMIN" ? adminItems : role === "VENDOR" ? vendorItems : userItems;
    const allItems = [...items, ...commonItems];

    const handleLogout = async () => {
        setIsLogoutLoading(true);
        try {
            await logoutUser();
            logout();
            toast.success("Logged out successfully");
            window.location.href = "/auth/login";
        } catch (error) {
            toast.error("Logout failed");
        } finally {
            setIsLogoutLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col h-full bg-slate-950 border-r border-white/5", className)} {...props}>
            <div className="p-8">
                <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-2xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                        <span className="text-white font-black text-xl">A</span>
                    </div>
                    <span className="text-xl font-display font-black tracking-tighter uppercase text-white">
                        AURA<span className="text-primary italic">.</span>
                    </span>
                </Link>

                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{role} PORTAL</span>
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest text-white/40">Welcome back,</p>
                        <h3 className="text-lg font-display font-black text-white">{user?.firstName || 'Aura User'}</h3>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-4 py-2">
                <div className="space-y-1">
                    {allItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center justify-between px-4 h-12 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-white" : "group-hover:text-primary")} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">{item.title}</span>
                                </div>
                                {isActive && <ChevronRight className="h-4 w-4 text-white/50" />}
                            </Link>
                        );
                    })}
                </div>
            </ScrollArea>

            <div className="p-6 space-y-3">
                <Button
                    variant="outline"
                    asChild
                    className="w-full h-12 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-white font-bold transition-all"
                >
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Store
                    </Link>
                </Button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full h-12 rounded-xl text-white/40 hover:text-destructive hover:bg-destructive/10 font-bold transition-all justify-start px-4"
                            disabled={isLogoutLoading}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border-white/10 text-white rounded-[2rem] p-8">
                        <AlertDialogHeader className="space-y-4">
                            <div className="w-16 h-16 rounded-[2rem] bg-destructive/10 flex items-center justify-center mb-2">
                                <LogOut className="h-8 w-8 text-destructive" />
                            </div>
                            <AlertDialogTitle className="text-3xl font-display font-black tracking-tight">
                                Signing <span className="text-destructive italic">Out?</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/50 text-base font-medium">
                                Are you sure you want to end your current session across all Aura systems?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8 gap-3 sm:gap-4 flex-col-reverse sm:flex-row">
                            <AlertDialogCancel className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                Stay Authenticated
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleLogout}
                                className="h-14 rounded-2xl bg-destructive text-white font-black uppercase tracking-widest shadow-xl shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                End Session
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
