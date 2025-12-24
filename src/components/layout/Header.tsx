"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, User, ArrowRight } from "lucide-react";
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

  const displayCategories = categories.length > 0 ? categories : [
    { name: "Smartphones", slug: "smartphones" },
    { name: "Laptops", slug: "laptops" },
    { name: "Audio", slug: "audio" },
    { name: "Wearables", slug: "wearables" },
    { name: "Gaming", slug: "gaming" },
    { name: "Accessories", slug: "accessories" }
  ];

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated, syncCart]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = cn(
    "text-sm font-bold uppercase tracking-widest transition-all duration-300",
    isOverlay ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-primary",
  );

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-all duration-500",
        isHome ? "fixed" : "sticky",
        isOverlay
          ? "h-24 border-transparent bg-transparent"
          : "h-20 border-b border-white/5 bg-background/80 backdrop-blur-xl shadow-2xl shadow-black/5",
      )}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex h-full items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary-glow border border-white/20 shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
              <Image src="/logo.svg" alt="Aura Commerce" width={20} height={20} className="sm:w-[26px] sm:h-[26px] brightness-0 invert" />
            </div>
            <span className={cn("text-xl sm:text-2xl font-display font-black tracking-tighter", isOverlay ? "text-white" : "text-foreground")}>
              AURA<span className="text-primary italic">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            <Link href="/" className={cn(linkClass, pathname === "/" && "text-primary")}>
              Home
            </Link>
            <Link href="/products" className={cn(linkClass, pathname === "/products" && "text-primary")}>
              Products
            </Link>

            {/* Robust Mega Menu */}
            <div className="relative group py-8">
              <button
                className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  linkClass,
                  pathname.startsWith("/products?category") && "text-primary"
                )}
              >
                Collections
                <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-500 z-50">
                <div className="w-[640px] p-8 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Curated Collections</p>
                      <div className="grid gap-2">
                        {displayCategories.slice(0, 6).map((category) => (
                          <Link
                            key={category.slug}
                            href={`/products?category=${category.slug}`}
                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group/item"
                          >
                            <div>
                              <div className="text-sm font-black uppercase tracking-widest text-white group-hover/item:text-primary transition-colors">
                                {category.name}
                              </div>
                              <p className="text-[10px] text-white/40 group-hover/item:text-white/60 transition-colors">
                                Explore our technical {category.name.toLowerCase()} essentials.
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-white/20 -translate-x-2 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group/img">
                        <Image
                          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
                          alt="Special Drop"
                          fill
                          className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Editor's Pick</p>
                          <h4 className="text-xl font-display font-black text-white leading-tight">Engineering the Future of Sound</h4>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/5">
                        <Link href="/products" className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                          View Everything <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/shops" className={cn(linkClass, pathname === "/shops" && "text-primary")}>
              Shops
            </Link>
            <Link href="/blog" className={cn(linkClass, pathname === "/blog" && "text-primary")}>
              Blog
            </Link>
            <Link href="/about" className={cn(linkClass, pathname === "/about" && "text-primary")}>
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="hidden md:flex relative">
              <div className={cn("flex items-center transition-all duration-500", isSearchOpen ? "w-72" : "w-11")}>
                {isSearchOpen && (
                  <Input
                    type="search"
                    placeholder="Search collections..."
                    className="pr-12 h-11 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-2xl animate-in fade-in slide-in-from-right-4 duration-500"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-11 w-11 shrink-0 rounded-2xl transition-all",
                    isOverlay ? "hover:bg-white/10 text-white" : "hover:bg-primary/10 text-foreground",
                    isSearchOpen && "absolute right-0"
                  )}
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
              className={cn(
                "relative h-11 w-11 rounded-2xl transition-all",
                isOverlay ? "hover:bg-white/10 text-white" : "hover:bg-primary/10"
              )}
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-lg shadow-primary/30">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User */}
            {isMounted && hasHydrated && isAuthenticated ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <Link href="/dashboard" className="flex items-center gap-3 pl-3 py-1.5 pr-4 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all duration-300">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary hidden sm:inline-block">
                    {user?.firstName || "Account"}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className={cn(
                  "hidden sm:flex text-xs font-black uppercase tracking-widest transition-colors",
                  isOverlay ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-primary"
                )}>
                  Login
                </Link>
                <Button asChild className="hidden sm:flex rounded-full px-6 font-black uppercase tracking-[0.15em] text-[10px] h-11 shadow-xl shadow-primary/20">
                  <Link href="/auth/register">Join Aura</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(
                  "lg:hidden h-11 w-11 rounded-2xl transition-all duration-300",
                  isOverlay
                    ? "text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg"
                    : "text-foreground bg-primary/5 hover:bg-primary/10 border border-primary/10"
                )}>
                  <Menu className="h-6 w-6 stroke-[2.5]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0 bg-slate-950 text-white border-white/5">
                <div className="flex h-full flex-col">
                  <SheetHeader className="p-8 border-b border-white/5">
                    <SheetTitle className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
                        <Image src="/logo.svg" alt="Aura" width={22} height={22} className="brightness-0 invert" />
                      </div>
                      <span className="text-2xl font-display font-black tracking-tighter text-white uppercase">AURA<span className="text-primary italic">.</span></span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto p-8 space-y-10">
                    <nav className="flex flex-col gap-6">
                      {[
                        { name: "Home", href: "/" },
                        { name: "Products", href: "/products" },
                        { name: "Shops", href: "/shops" },
                        { name: "Blog", href: "/blog" },
                        { name: "About", href: "/about" },
                        { name: "Contact", href: "/contact" }
                      ].map((item) => (
                        <SheetClose asChild key={item.name}>
                          <Link
                            href={item.href}
                            className="text-4xl font-display font-black hover:text-primary transition-colors tracking-tight"
                          >
                            {item.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>

                    <div className="space-y-6 pt-10 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Collections</p>
                      <div className="grid grid-cols-2 gap-3">
                        {displayCategories.slice(0, 6).map((cat) => (
                          <SheetClose asChild key={cat.slug}>
                            <Link href={`/products?category=${cat.slug}`} className="px-5 py-4 rounded-3xl bg-white/5 hover:bg-primary/10 hover:text-primary transition-all font-bold text-xs uppercase tracking-widest text-center">
                              {cat.name}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-white/5 space-y-4">
                    {!isAuthenticated && (
                      <div className="flex gap-3">
                        <SheetClose asChild className="flex-1">
                          <Link href="/auth/login" className="flex items-center justify-center h-14 rounded-2xl bg-white/10 text-white font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/20 transition-colors">
                            Sign In
                          </Link>
                        </SheetClose>
                        <SheetClose asChild className="flex-1">
                          <Link href="/auth/register" className="flex items-center justify-center h-14 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                            Register
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                    {isAuthenticated && (
                      <SheetClose asChild>
                        <Link href="/dashboard" className="flex items-center justify-center w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                          My Dashboard
                        </Link>
                      </SheetClose>
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

