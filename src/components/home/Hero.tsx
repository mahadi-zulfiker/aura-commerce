"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { imageBlurDataUrl } from "@/lib/placeholder";

const SLIDES = [
  {
    id: 1,
    title: "The Heart of Tech",
    subtitle: "Premium Components",
    description: "Discover the engineering marvels that power your world. High-performance hardware curated for the next generation of builders.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=80",
    cta: "Shop Components",
    link: "/products?category=components",
    color: "from-primary/20",
  },
  {
    id: 2,
    title: "Next-Gen Computing",
    subtitle: "Professional Grade",
    description: "Unleash your creativity with machines built for performance. Cutting-edge processors and stunning displays for the modern professional.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=2400&q=80",
    cta: "Shop Laptops",
    link: "/products?category=laptops",
    color: "from-blue-600/20",
  },
  {
    id: 3,
    title: "Immersive Soundscape",
    subtitle: "Elite Audio Collection",
    description: "Lose yourself in pure, high-fidelity sound. Our noise-canceling technology brings every note to life with crystal clarity.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2400&q=80",
    cta: "Shop Audio",
    link: "/products?category=audio",
    color: "from-purple-600/20",
  },
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-screen min-h-screen overflow-hidden group">
      {/* Slider */}
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  placeholder="blur"
                  blurDataURL={imageBlurDataUrl}
                />
                <div className={cn("absolute inset-0 bg-gradient-to-r via-slate-950/40 to-slate-950/20", slide.color)} />
                <div className="absolute inset-0 bg-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="container relative h-full flex items-center z-10 mx-auto px-4">
                <div className="max-w-2xl">
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md mb-6">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-xs sm:text-sm font-semibold text-primary-foreground tracking-wide uppercase">
                            {slide.subtitle}
                          </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6 drop-shadow-sm">
                          {slide.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-xl">
                          {slide.description}
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <Button size="lg" className="rounded-full px-8 text-base glow-cyan" asChild>
                            <Link href={slide.link}>
                              {slide.cta}
                              <ArrowRight className="h-5 w-5 ml-2" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 text-base border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
                            asChild
                          >
                            <Link href="/products">Browse All</Link>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-8 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="glass"
          size="icon"
          className="h-12 w-12 rounded-full pointer-events-auto shadow-lg"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="glass"
          size="icon"
          className="h-12 w-12 rounded-full pointer-events-auto shadow-lg"
          onClick={scrollNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full",
              selectedIndex === index ? "w-8 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-20">
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
      </div>

      {/* Ambient Gradient Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-aura-sky/20 blur-[120px] rounded-full" />
      </div>
    </section>
  );
}

