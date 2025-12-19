"use client";

import Image from "next/image";
import { imageBlurDataUrl } from "@/lib/placeholder";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-display font-bold">Designed for everyday tech rituals</h1>
          <p className="text-muted-foreground">
            Aura Commerce curates thoughtful technology that blends quietly into your life. From
            productivity essentials to immersive entertainment, we champion calm, premium
            experiences.
          </p>
          <p className="text-muted-foreground">
            We partner with forward-looking brands to deliver devices and accessories that feel
            refined, reliable, and ready for the moments that matter most.
          </p>
        </div>
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted/30 border border-border/50">
          <Image
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
            alt="Aura Commerce studio"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Curated with intention",
            description: "Every product is handpicked for design, performance, and longevity.",
          },
          {
            title: "Built for real life",
            description: "We focus on items that help you work, play, and recharge seamlessly.",
          },
          {
            title: "Always human support",
            description: "Our concierge team is available to guide you at every step.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border/50 p-6 bg-background">
            <h3 className="font-display font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
