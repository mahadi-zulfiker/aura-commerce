"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { imageBlurDataUrl } from "@/lib/placeholder";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Tech Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    content:
      "Aura Commerce has completely transformed my tech setup. The curation and support are unmatched. My new headphones are absolutely incredible!",
    rating: 5,
    product: "Studio Pro Wireless Headphones",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Professional Gamer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    content:
      "As a competitive gamer, I need reliable gear. The controller from Aura has the best response time I've ever experienced. Worth every penny!",
    rating: 5,
    product: "Pro Gaming Controller",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    content:
      "The UltraBook Pro handles all my video editing without breaking a sweat. Fast shipping and premium packaging. Highly recommend Aura!",
    rating: 5,
    product: "UltraBook Pro 16",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-5xl font-display font-black mb-6 tracking-tight">
            Loved by the <span className="gradient-text">Community</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Don't just take our word for it. Join thousands of creators and gamers who have leveled up their experience with Aura.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 rounded-[2rem] bg-card/40 backdrop-blur-sm border border-border/40 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -right-4 h-12 w-12 bg-primary flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20 transition-transform duration-500 group-hover:rotate-12">
                <Quote className="h-6 w-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < testimonial.rating ? "fill-accent text-accent" : "text-muted-foreground/30")} />
                ))}
              </div>

              {/* Content */}
              <p className="text-lg text-foreground/90 mb-8 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              {/* Product Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50 text-[10px] font-bold text-primary uppercase tracking-widest mb-8">
                Purchased: {testimonial.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/40">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  placeholder="blur"
                  blurDataURL={imageBlurDataUrl}
                />
                <div>
                  <p className="font-bold text-base leading-none mb-1">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "50K+", label: "Happy Customers" },
            { value: "4.9", label: "Average Rating" },
            { value: "100+", label: "Countries Served" },
            { value: "24/7", label: "Customer Support" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 rounded-3xl bg-muted/20 border border-border/40 hover:bg-muted/30 transition-colors duration-300"
            >
              <p className="text-4xl lg:text-5xl font-display font-black gradient-text leading-none mb-2">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

