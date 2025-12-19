"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated) {
            // Simple client-side protection
            // Ideally should be middleware or server component check
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    if (!mounted) {
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
