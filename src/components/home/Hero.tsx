import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageBlurDataUrl } from "@/lib/placeholder";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] pt-24 lg:pt-28 flex items-center justify-center overflow-hidden">
      {/* Immersive Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=80"
          alt="Aura Commerce hero banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
          placeholder="blur"
          blurDataURL={imageBlurDataUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-background" />
      </div>

      {/* Ambient Layers */}
      <div className="absolute inset-0 animated-gradient opacity-60 mix-blend-screen" />

      {/* Gradient Orbs */}
      <div className="gradient-orb w-[600px] h-[600px] bg-primary/25 -top-40 -right-40" />
      <div
        className="gradient-orb w-[500px] h-[500px] bg-aura-sky/20 bottom-0 -left-40"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="gradient-orb w-[420px] h-[420px] bg-accent/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ animationDelay: "-10s" }}
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-white">Aura Essentials 2024</span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Calm, premium tech
            <br />
            <span className="bg-gradient-to-r from-primary via-aura-sky to-accent bg-clip-text text-transparent">
              for modern living
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Discover thoughtfully curated electronics built for focus, flow, and everyday clarity.
            From flagship phones to immersive audio, elevate your setup with ease.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="xl" asChild>
              <Link href="/products">
                Shop Collection
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              asChild
              className="border-white/40 text-white hover:bg-white/10"
            >
              <Link href="/products?category=new">What's New</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
              <Truck className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-white/60">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
              <Shield className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">2 Year Warranty</p>
                <p className="text-xs text-white/60">Extended protection</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
              <Headphones className="h-6 w-6 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-white/60">Expert assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
