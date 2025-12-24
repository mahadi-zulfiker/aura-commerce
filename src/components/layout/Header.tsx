"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useCategories } from "@/hooks/use-categories";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { openCart, getTotalItems, syncCart } = useCartStore();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();
  const totalItems = getTotalItems();
  const { data: categories = [] } = useCategories();
  const isHome = pathname === "/";
  const isOverlay = isHome && !isScrolled;

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated, syncCart]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = cn(
    "text-sm font-medium transition-colors",
    isOverlay ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground",
  );
  const ghostButtonClass = isOverlay ? "text-white hover:text-white hover:bg-white/10" : "";

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-all duration-300",
        isHome ? "fixed" : "sticky",
        isOverlay
          ? "border-transparent bg-transparent"
          : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 border border-primary/20 shadow-glow">
              <Image src="/logo.svg" alt="Aura Commerce" width={24} height={24} />
            </div>
            <span className={cn("text-2xl font-display font-bold tracking-tight", isOverlay && "text-white")}>
              <span className="gradient-text">Aura</span>{" "}
              <span className={cn("text-foreground/80", isOverlay && "text-white/90")}>Commerce</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className={cn(linkClass, pathname === "/" && "text-primary font-bold")}>
              Home
            </Link>
            <Link href="/products" className={cn(linkClass, pathname === "/products" && "text-primary font-bold")}>
              All-Products
            </Link>
            <Link href="/shops" className={cn(linkClass, pathname === "/shops" && "text-primary font-bold")}>
              Shops
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent h-auto p-0",
                      linkClass
                    )}
                  >
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background border rounded-xl shadow-xl">
                      {categories.map((category) => (
                        <NavigationMenuLink asChild key={category.id}>
                          <Link
                            href={`/products?category=${category.slug}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{category.name}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Explore our collection of {category.name.toLowerCase()}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/about" className={cn(linkClass, pathname === "/about" && "text-primary font-bold")}>
              About
            </Link>
            <Link href="/contact" className={cn(linkClass, pathname === "/contact" && "text-primary font-bold")}>
              Contact
            </Link>
            <Link href="/blog" className={cn(linkClass, pathname === "/blog" && "text-primary font-bold")}>
              Blog
            </Link>
          </nav>

          {/* Search, Cart, User */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:flex relative">
              <div
                className={cn(
                  "flex items-center transition-all duration-300 overflow-hidden",
                  isSearchOpen ? "w-64" : "w-10",
                )}
              >
                {isSearchOpen && (
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pr-10 animate-fade-in"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("shrink-0", ghostButtonClass, isSearchOpen && "absolute right-0")}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("relative", ghostButtonClass)}
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Notifications - Visible on all screens if authenticated */}
            {isMounted && hasHydrated && isAuthenticated && (
              <NotificationBell />
            )}

            {/* User Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {isMounted && hasHydrated && isAuthenticated ? (
                <Button variant="ghost" size="icon" asChild className={cn("sm:w-auto sm:px-3", ghostButtonClass)}>
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline-block lg:inline-block">{user?.firstName || "Account"}</span>
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="ghost" size="icon" asChild className={cn("sm:w-auto sm:px-3", ghostButtonClass)}>
                    <Link href="/auth/login" title="Login">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline-block">Login</span>
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="hidden sm:flex">
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("lg:hidden", ghostButtonClass)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetHeader className="border-b border-border/60 px-6 py-5">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 border border-primary/20 shadow-glow">
                      <Image src="/logo.svg" alt="Aura Commerce" width={24} height={24} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Aura Commerce</p>
                      <p className="text-xs text-muted-foreground">Curated tech essentials</p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col">
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="mb-6">
                      <Input type="search" placeholder="Search products..." className="w-full" />
                    </div>
                    <nav className="space-y-2">
                      <SheetClose asChild>
                        <Link
                          href="/products"
                          className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          Shop all
                          <span className="text-xs text-muted-foreground">Browse</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/shops"
                          className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                        >
                          Shops
                          <span className="text-xs text-muted-foreground">Local brands</span>
                        </Link>
                      </SheetClose>
                    </nav>

                    <div className="mt-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Categories
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {categories.slice(0, 8).map((category) => (
                          <SheetClose asChild key={category.id}>
                            <Link
                              href={`/products?category=${category.slug}`}
                              className="rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                            >
                              {category.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/60 px-6 py-4">
                    {isMounted && hasHydrated && isAuthenticated ? (
                      <div className="flex flex-col gap-3">
                        <SheetClose asChild>
                          <Link
                            href="/dashboard"
                            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                          >
                            Go to dashboard
                          </Link>
                        </SheetClose>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <SheetClose asChild>
                          <Link
                            href="/auth/login"
                            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                          >
                            Login
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/auth/register"
                            className={cn(buttonVariants({ variant: "default" }), "w-full")}
                          >
                            Create account
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
