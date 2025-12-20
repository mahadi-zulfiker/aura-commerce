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
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> { }

export function SidebarNav({ className, ...props }: SidebarNavProps) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const role = user?.role || "USER";

    const commonItems = [
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ];

    const userItems = [
        {
            title: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Orders",
            href: "/dashboard/orders",
            icon: History,
        },
        {
            title: "Returns",
            href: "/dashboard/returns",
            icon: RotateCcw,
        },
        {
            title: "Wishlist",
            href: "/dashboard/wishlist",
            icon: Heart,
        },
        {
            title: "Addresses",
            href: "/dashboard/addresses",
            icon: Users, // Using Users icon as placeholder for address/profile
        },
    ];

    const vendorItems = [
        {
            title: "Dashboard",
            href: "/dashboard", // Vendor dashboard overview
            icon: LayoutDashboard,
        },
        {
            title: "Products",
            href: "/dashboard/products",
            icon: Package,
        },
        {
            title: "Orders",
            href: "/dashboard/vendor-orders",
            icon: ShoppingBag,
        },
        {
            title: "Returns",
            href: "/dashboard/returns",
            icon: RotateCcw,
        },
        {
            title: "Shop Settings",
            href: "/dashboard/shop-settings",
            icon: Store,
        },
    ];

    const adminItems = [
        {
            title: "Analytics",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Users",
            href: "/dashboard/users",
            icon: Users,
        },
        {
            title: "Vendors",
            href: "/dashboard/vendors",
            icon: Store,
        },
        {
            title: "Categories",
            href: "/dashboard/categories",
            icon: Tag,
        },
        {
            title: "Brands",
            href: "/dashboard/brands",
            icon: BadgeCheck,
        },
        {
            title: "Products",
            href: "/dashboard/all-products",
            icon: Package,
        },
        {
            title: "Orders",
            href: "/dashboard/all-orders",
            icon: ShoppingBag,
        },
        {
            title: "Returns",
            href: "/dashboard/returns",
            icon: RotateCcw,
        },
        {
            title: "Coupons",
            href: "/dashboard/coupons",
            icon: CreditCard,
        },
        {
            title: "Store Settings",
            href: "/dashboard/store-settings",
            icon: SlidersHorizontal,
        },
    ];

    let items = userItems;
    if (role === "ADMIN") items = adminItems;
    else if (role === "VENDOR") items = vendorItems;

    const allItems = [...items, ...commonItems];

    return (
        <div className={cn("flex flex-col h-full border-r bg-background", className)} {...props}>
            <div className="p-6">
                <h2 className="text-lg font-semibold tracking-tight mb-2">
                    {role === 'ADMIN' ? 'Admin Panel' : role === 'VENDOR' ? 'Vendor Portal' : 'My Account'}
                </h2>
                <p className="text-sm text-muted-foreground">
                    Welcome back, {user?.firstName || 'User'}
                </p>
            </div>
            <ScrollArea className="flex-1 px-4">
                <div className="space-y-2">
                    {allItems.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 mt-auto border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                        logoutUser().finally(() => {
                            window.location.href = '/auth/login';
                        });
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
