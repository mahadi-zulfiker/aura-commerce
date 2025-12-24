"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog";
import { imageBlurDataUrl } from "@/lib/placeholder";

export function BlogSection() {
    const posts = blogPosts.slice(0, 3);

    return (
        <section className="py-24 lg:py-40 bg-white relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aura-sky/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24 text-center md:text-left">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950 text-white mb-8 shadow-2xl">
                            <Newspaper className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Journal</span>
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-display font-black mb-8 tracking-tighter text-slate-950">
                            Stories of <span className="text-primary italic">Innovation.</span>
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            Explore the fusion of technology, design, and modern lifestyle through our curated journal.
                        </p>
                    </div>
                    <Button size="xl" className="rounded-2xl px-8 h-16 font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20" asChild>
                        <Link href="/blog">
                            Browse All Stories <ArrowRight className="h-4 w-4 ml-3" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                        >
                            <Link
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col h-full rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        placeholder="blur"
                                        blurDataURL={imageBlurDataUrl}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute top-8 left-8">
                                        <span className="px-5 py-2.5 rounded-2xl bg-white/95 backdrop-blur text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-2xl">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 p-10 flex flex-col">
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{post.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span>{post.author}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-display font-black mb-4 text-slate-950 group-hover:text-primary transition-colors leading-tight tracking-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-500 text-base leading-relaxed line-clamp-2 mb-8 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-primary group-hover:gap-6 transition-all">
                                        Full Story
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

