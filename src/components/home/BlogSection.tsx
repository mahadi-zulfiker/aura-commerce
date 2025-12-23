import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog";
import { imageBlurDataUrl } from "@/lib/placeholder";

export function BlogSection() {
    const posts = blogPosts.slice(0, 3);

    return (
        <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12 text-center sm:text-left">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">
                            Latest from the <span className="gradient-text">Blog</span>
                        </h2>
                        <p className="text-muted-foreground">Insights on design, tech, and modern living.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/blog">
                            View All Posts
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col h-full rounded-2xl overflow-hidden border border-border/50 bg-background hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    placeholder="blur"
                                    blurDataURL={imageBlurDataUrl}
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-semibold text-primary">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        <span>{post.author}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                                    Read More
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
