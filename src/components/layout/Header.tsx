"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();
  const { data: categories = [] } = useCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 border border-primary/20 shadow-glow">
              <Image src="/logo.svg" alt="Aura Commerce" width={24} height={24} />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">
              <span className="gradient-text">Aura</span>{" "}
              <span className="text-foreground/80">Commerce</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              All Products
            </Link>
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search, Cart, User */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="hidden md:flex relative">
              <div
                className={cn(
                  "flex items-center transition-all duration-300 overflow-hidden",
                  isSearchOpen ? "w-64" : "w-10"
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
                  className={cn(
                    "shrink-0",
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
              className="relative"
              onClick={openCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-scale-in">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full"
              />
            </div>
            <nav className="flex flex-col gap-2">
              <Link
                href="/products"
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

