import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/data/blog";
import { imageBlurDataUrl } from "@/lib/placeholder";

export default function BlogPage() {
  const [featured, ...posts] = blogPosts;

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Aura Journal
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold">Stories for the calm-tech community.</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Insights on design, routines, and gear that helps you stay intentional. Fresh stories every week.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-border/60">
          <div className="relative h-72 lg:h-[360px]">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={imageBlurDataUrl}
            />
          </div>
          <CardContent className="space-y-4">
            <Badge variant="category">{featured.category}</Badge>
            <div>
              <h2 className="text-2xl font-display font-bold">{featured.title}</h2>
              <p className="text-sm text-muted-foreground">
                {featured.author} · {featured.date} · {featured.readTime}
              </p>
            </div>
            <p className="text-muted-foreground">{featured.excerpt}</p>
            <Button variant="glow" asChild>
              <Link href={`/blog/${featured.slug}`}>Read story</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.slug} className="border-border/60">
              <CardContent className="flex gap-4">
                <div className="relative h-24 w-28 rounded-xl overflow-hidden border border-border/50">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={imageBlurDataUrl}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Badge variant="category">{post.category}</Badge>
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.author} · {post.date} · {post.readTime}
                    </p>
                  </div>
                  <Button variant="link" asChild className="px-0">
                    <Link href={`/blog/${post.slug}`}>Read more</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
