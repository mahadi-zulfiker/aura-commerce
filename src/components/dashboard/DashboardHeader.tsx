"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Sparkles, User, LogOut, LayoutDashboard, Settings, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { useAuthStore } from "@/store/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/lib/api";
import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const titleMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/orders": "Tracking",
  "/dashboard/all-orders": "Global Orders",
  "/dashboard/vendor-orders": "Sales Management",
  "/dashboard/products": "Catalog",
  "/dashboard/all-products": "Master Catalog",
  "/dashboard/users": "Identity Management",
  "/dashboard/vendors": "Partners",
  "/dashboard/coupons": "Incentives",
  "/dashboard/addresses": "Nodes",
  "/dashboard/wishlist": "Wishlist",
  "/dashboard/settings": "Preferences",
  "/dashboard/shop-settings": "Shop Engine",
  "/dashboard/categories": "Taxonomy",
  "/dashboard/brands": "Entity Recognition",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const title = titleMap[pathname] ?? "Workspace";
  const role = user?.role ?? "USER";

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      toast.success("Identity disconnected");
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error("Disconnection failed");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-5 md:px-10">
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 rounded-xl bg-white/5 border border-white/5">
                <Menu className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] border-white/5">
              <SidebarNav className="border-r-0" />
            </SheetContent>
          </Sheet>

          <div className="hidden lg:flex items-center relative group">
            <Search className="absolute left-4 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Command + K to search..."
              className="w-64 h-11 bg-white/5 border-white/5 rounded-2xl pl-11 text-xs font-black uppercase tracking-widest focus:border-primary/50 focus:ring-primary/20 transition-all placeholder:text-white/10"
            />
          </div>

          <div className="md:hidden lg:block">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-0.5">
              <Sparkles className="h-3 w-3 text-primary" />
              {role} INFRASTRUCTURE
            </div>
            <h1 className="text-xl font-display font-black text-white tracking-tight">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:bg-white/10 transition-colors">
            <Globe className="h-3 w-3 text-primary animate-spin-slow" />
            Online
          </div>

          <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-white/5 border border-white/5 relative group hover:bg-white/10 transition-all">
            <Bell className="h-5 w-5 text-white group-hover:text-primary" />
            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary shadow-glow-primary border-2 border-slate-950" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <User className="h-5 w-5" />
                </div>
                <div className="hidden sm:block text-left pr-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">{user?.firstName || "Account"}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/30">{role}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border-white/10 text-white rounded-3xl p-2 shadow-2xl mt-2" align="end">
              <DropdownMenuLabel className="px-3 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Access Protocol</p>
                <p className="text-sm font-display font-black text-white">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <div className="p-1 space-y-1">
                <DropdownMenuItem asChild className="rounded-2xl h-11 px-3 focus:bg-white/5 focus:text-primary transition-all cursor-pointer">
                  <Link href="/dashboard" className="flex items-center gap-3">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-2xl h-11 px-3 focus:bg-white/5 focus:text-primary transition-all cursor-pointer">
                  <Link href="/dashboard/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Preferences</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-2xl h-11 px-3 focus:bg-white/5 focus:text-primary transition-all cursor-pointer">
                  <Link href="/" className="flex items-center gap-3">
                    <Globe className="h-4 w-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Open Storefront</span>
                  </Link>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              <div className="p-1">
                <DropdownMenuItem
                  onClick={() => setShowLogoutAlert(true)}
                  className="rounded-2xl h-11 px-3 focus:bg-destructive/10 text-destructive transition-all cursor-pointer flex items-center gap-3"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest">End Session</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent className="bg-slate-900 border-white/10 text-white rounded-[2.5rem] p-10 max-w-md">
          <AlertDialogHeader className="space-y-6">
            <div className="w-20 h-20 rounded-[2.5rem] bg-destructive/10 flex items-center justify-center mx-auto mb-2 group">
              <LogOut className="h-10 w-10 text-destructive group-hover:rotate-12 transition-transform" />
            </div>
            <div className="text-center space-y-2">
              <AlertDialogTitle className="text-4xl font-display font-black tracking-tight">
                Terminating <span className="text-destructive italic">Access.</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white/40 text-base font-medium leading-relaxed">
                Confirming session termination as per protocols. All unsaved system state may be lost.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <div className="mt-10 flex flex-col gap-4">
            <AlertDialogAction
              onClick={handleLogout}
              className="h-16 rounded-3xl bg-destructive text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              End Session
            </AlertDialogAction>
            <AlertDialogCancel className="h-16 rounded-3xl bg-white/5 border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all">
              Cancel Request
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
