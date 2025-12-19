import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { blogPosts } from "@/data/blog";
import { imageBlurDataUrl } from "@/lib/placeholder";

type BlogPageProps = {
  params: {
    slug: string;
  };
};

export default function BlogPostPage({ params }: BlogPageProps) {
  const post = blogPosts.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-10">
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link href="/blog">Back to journal</Link>
        </Button>
        <Badge variant="category">{post.category}</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold">{post.title}</h1>
        <p className="text-muted-foreground text-sm">
          {post.author} · {post.date} · {post.readTime}
        </p>
      </div>

      <div className="relative h-72 md:h-[420px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={imageBlurDataUrl}
        />
      </div>

      <Card className="border-border/60">
        <CardContent className="space-y-6 text-muted-foreground">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
