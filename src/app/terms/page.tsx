import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { imageBlurDataUrl } from "@/lib/placeholder";

const termsSections = [
  {
    title: "Ordering and payments",
    description:
      "Orders are confirmed once payment is processed. We may cancel orders that fail verification checks.",
  },
  {
    title: "Pricing and promotions",
    description:
      "Pricing is subject to change. Promotional codes cannot be combined unless stated otherwise.",
  },
  {
    title: "Account responsibilities",
    description:
      "You are responsible for keeping your account credentials secure and up to date.",
  },
];

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <FileText className="h-4 w-4" />
            Terms of service
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">A clear agreement for a calm experience.</h1>
          <p className="text-muted-foreground text-lg">
            These terms outline how we operate, what you can expect from us, and how we protect both parties. Last
            updated: January 2024.
          </p>
          <div className="flex gap-3">
            <Button variant="glow" asChild>
              <Link href="/contact">Questions about these terms</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy">Privacy policy</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-72 lg:h-[360px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
          <Image
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&q=80"
            alt="Aura Commerce legal documentation"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {termsSections.map((section) => (
          <Card key={section.title} className="border-border/60">
            <CardContent className="space-y-3">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-3xl border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
        By using Aura Commerce, you agree not to misuse our platform, resell products without authorization, or engage
        in fraudulent activity. We reserve the right to suspend accounts that violate these terms.
      </section>
    </div>
  );
}
