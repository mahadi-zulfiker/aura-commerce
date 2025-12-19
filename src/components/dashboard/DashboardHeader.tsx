"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { useAuthStore } from "@/store/auth";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/orders": "Orders",
  "/dashboard/all-orders": "Orders",
  "/dashboard/vendor-orders": "Orders",
  "/dashboard/products": "Products",
  "/dashboard/all-products": "Products",
  "/dashboard/users": "Users",
  "/dashboard/vendors": "Vendors",
  "/dashboard/coupons": "Coupons",
  "/dashboard/addresses": "Addresses",
  "/dashboard/wishlist": "Wishlist",
  "/dashboard/settings": "Settings",
  "/dashboard/shop-settings": "Shop Settings",
  "/dashboard/categories": "Categories",
  "/dashboard/brands": "Brands",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const title = titleMap[pathname] ?? "Dashboard";
  const role = user?.role ?? "USER";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px]">
              <SidebarNav className="border-r-0 bg-background" />
            </SheetContent>
          </Sheet>
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              {role} workspace
            </div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex">
            {user?.email ?? "Signed in"}
          </Badge>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/">Back to store</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
