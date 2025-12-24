"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Category } from "@/types/store";
import { imageBlurDataUrl } from "@/lib/placeholder";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
    categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <Link
                        href={`/products?category=${category.slug}`}
                        className="group block relative aspect-square rounded-3xl overflow-hidden bg-muted/20 border border-border/40 hover:border-primary/40 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/10"
                    >
                        {/* Background Image */}
                        <Image
                            src={category.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"}
                            alt={category.name}
                            fill
                            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            placeholder="blur"
                            blurDataURL={imageBlurDataUrl}
                        />

                        {/* Glassmorphism Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Light streak reflex */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 border-2 border-white/10 rounded-3xl" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                            <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="font-display font-black text-lg text-white mb-1 drop-shadow-md">
                                    {category.name}
                                </h3>
                                <div className="h-0.5 w-0 group-hover:w-full bg-primary mx-auto transition-all duration-500 mb-2" />
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {category.productCount} Products
                                </p>
                            </div>
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
