"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Github, Twitter, Instagram, Youtube, ArrowRight, Sparkles } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const { data: categories = [] } = useCategories();

  // Common categories as fallback or additional links
  const defaultCategories = [
    { name: "Smartphones", slug: "smartphones" },
    { name: "Laptops", slug: "laptops" },
    { name: "Audio", slug: "audio" },
    { name: "Wearables", slug: "wearables" },
    { name: "Gaming", slug: "gaming" },
  ];

  const displayCategories = categories.length > 0 ? categories.slice(0, 5) : defaultCategories;

  return (
    <footer className="bg-slate-950 text-white pt-20 lg:pt-32 pb-10 lg:pb-16 overflow-hidden relative border-t border-white/5">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
      <div className="absolute top-0 left-1/4 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-primary/10 blur-[100px] lg:blur-[180px] rounded-full -translate-y-1/2 opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[250px] lg:w-[500px] h-[250px] lg:h-[500px] bg-aura-sky/10 blur-[80px] lg:blur-[150px] rounded-full translate-y-1/2 opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Top Section: Newsletter & Brand Brief */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 mb-20 lg:mb-32 p-8 lg:p-16 rounded-[2rem] lg:rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group text-center lg:text-left">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-aura-sky/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-primary">Join the Inner Circle</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-display font-black mb-6 tracking-tight leading-tight">
              Unlock the <span className="text-primary italic">Future.</span>
            </h2>
            <p className="text-base lg:text-lg text-white/50 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Subscribers get early access to drops, exclusive technical guides, and community-only pricing.
            </p>
          </div>

          <div className="w-full lg:max-w-md relative z-10">
            <form className="flex flex-col sm:flex-row gap-4 relative group/input" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-14 lg:h-16 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-2xl lg:rounded-[1.25rem] pl-6 transition-all duration-500 placeholder:text-white/20 sm:pr-40"
              />
              <Button type="submit" className="h-14 lg:h-12 sm:absolute sm:right-2 sm:top-2 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Join Now <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-12 mb-20 lg:mb-32">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-4 mb-8 lg:mb-10 group">
              <div className="relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-2xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
                <Image src="/logo.svg" alt="Aura" width={28} height={28} className="lg:w-8 lg:h-8 brightness-0 invert" />
              </div>
              <span className="text-3xl lg:text-4xl font-display font-black tracking-tighter uppercase">
                AURA<span className="text-primary italic">.</span>
              </span>
            </Link>
            <p className="text-base lg:text-lg text-white/40 mb-8 lg:mb-10 leading-relaxed font-medium max-w-sm">
              We curate high-performance tech for the modern digital landscape. Experience engineering excellence.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Youtube, Github].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="h-12 w-12 lg:h-14 lg:w-14 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white text-white/40 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <Icon className="h-5 w-5 lg:h-6 lg:w-6 stroke-[1.5]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Nav Categories */}
          <div className="lg:col-span-2 lg:ml-auto text-center lg:text-left">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-8 lg:mb-10">Collections</h4>
            <ul className="space-y-4 lg:space-y-6">
              {displayCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-white/40 hover:text-white transition-all duration-300 font-bold text-sm tracking-wide uppercase group flex items-center justify-center lg:justify-start gap-2"
                  >
                    <span className="hidden lg:block w-0 h-[1.5px] bg-primary group-hover:w-3 transition-all duration-300 rounded-full" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 text-center lg:text-left">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-8 lg:mb-10">Company</h4>
            <ul className="space-y-4 lg:space-y-6">
              {[
                { label: "The Journal", href: "/blog" },
                { label: "Our Story", href: "/about" },
                { label: "Explore Shops", href: "/shops" },
                { label: "Join the Team", href: "/careers" },
                { label: "Contact Us", href: "/contact" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/40 hover:text-white transition-all duration-300 font-bold text-sm tracking-wide uppercase group flex items-center justify-center lg:justify-start gap-2">
                    <span className="hidden lg:block w-0 h-[1.5px] bg-primary group-hover:w-3 transition-all duration-300 rounded-full" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 text-center lg:text-left">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-8 lg:mb-10">Support</h4>
            <ul className="space-y-4 lg:space-y-6">
              {[
                { label: "FAQ Center", href: "/faq" },
                { label: "Shipping Policy", href: "/shipping" },
                { label: "Return Portal", href: "/returns" },
                { label: "Warranty Info", href: "/warranty" },
                { label: "Get Help", href: "/contact" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/40 hover:text-white transition-all duration-300 font-bold text-sm tracking-wide uppercase group flex items-center justify-center lg:justify-start gap-2">
                    <span className="hidden lg:block w-0 h-[1.5px] bg-primary group-hover:w-3 transition-all duration-300 rounded-full" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 text-center lg:text-left">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-8 lg:mb-10">Base</h4>
            <ul className="space-y-6 lg:space-y-8 mt-2">
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-5">
                <div className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-xl lg:rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 leading-none">Global HQ</span>
                  <span className="text-sm font-bold text-white/70 leading-relaxed">Innovation Drive,<br />San Francisco, CA</span>
                </div>
              </li>
              <li className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-5">
                <div className="h-10 w-10 lg:h-12 lg:w-12 shrink-0 rounded-xl lg:rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 leading-none">Support</span>
                  <span className="text-sm font-bold text-white/70 tracking-wider font-display">+1 (555) 000-0000</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 lg:pt-16 border-t border-white/5 flex flex-col items-center justify-between gap-8 lg:gap-10">
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] lg:text-sm text-white/20 font-bold tracking-widest uppercase text-center">
            <span>© 2025</span>
            <span className="text-white/40">Aura Commerce</span>
            <span className="hidden sm:block h-1 w-1 rounded-full bg-primary" />
            <span className="w-full sm:w-auto mt-2 sm:mt-0">All Systems Operational</span>
          </div>

          <div className="flex gap-6 lg:gap-12">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Warranty", href: "/warranty" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-colors duration-300">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

