import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { imageBlurDataUrl } from "@/lib/placeholder";

const coverageHighlights = [
  {
    title: "2-year standard warranty",
    description: "Coverage for hardware defects, manufacturing issues, and system failures.",
  },
  {
    title: "Priority replacements",
    description: "Advance replacement shipped within 48 hours for Aura Care members.",
  },
  {
    title: "Extended protection",
    description: "Add accidental damage coverage on select devices at checkout.",
  },
];

export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Aura warranty
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Protection that keeps your gear ready.</h1>
          <p className="text-muted-foreground text-lg">
            Every Aura Commerce purchase includes a 2-year warranty backed by our concierge team. We handle repairs,
            replacements, and troubleshooting with a single point of contact.
          </p>
          <div className="flex gap-3">
            <Button variant="glow" asChild>
              <Link href="/contact">Start a claim</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/faq">Warranty FAQ</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-72 lg:h-[380px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
          <Image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80"
            alt="Aura Commerce warranty support"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {coverageHighlights.map((item) => (
          <Card key={item.title} className="border-border/60">
            <CardContent className="space-y-3">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">What is covered</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Manufacturing defects, battery failures, display issues, and internal component malfunctions. We cover
              labor, parts, and return shipping for confirmed warranty cases.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Wrench className="h-5 w-5" />
              <h3 className="text-lg font-semibold">What is not covered</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Accidental damage, theft, and unauthorized repairs. You can add accidental coverage during checkout for
              select items.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
