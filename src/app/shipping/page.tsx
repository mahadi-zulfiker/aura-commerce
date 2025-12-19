import Image from "next/image";
import Link from "next/link";
import { Truck, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { imageBlurDataUrl } from "@/lib/placeholder";

const shippingTiers = [
  {
    title: "Standard shipping",
    description: "3-5 business days within the continental US.",
    price: "Free over $100",
  },
  {
    title: "Express delivery",
    description: "1-2 business days with signature confirmation.",
    price: "$18 flat rate",
  },
  {
    title: "International",
    description: "5-12 business days with duties pre-calculated.",
    price: "Starts at $25",
  },
];

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Shipping details
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Fast, insured delivery for every order.</h1>
          <p className="text-muted-foreground text-lg">
            We ship daily from our California fulfillment studio with real-time tracking and optional signature
            delivery.
          </p>
          <div className="flex gap-3">
            <Button variant="glow" asChild>
              <Link href="/products">Shop now</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Shipping questions</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-72 lg:h-[380px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
          <Image
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80"
            alt="Aura Commerce shipping desk"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {shippingTiers.map((tier) => (
          <Card key={tier.title} className="border-border/60">
            <CardContent className="space-y-3">
              <h3 className="text-xl font-semibold">{tier.title}</h3>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
              <p className="text-sm font-semibold text-primary">{tier.price}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Truck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Processing timeline</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Orders placed before 2 PM PT ship the same day. We hold orders for 24 hours if you need edits.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Globe className="h-5 w-5" />
              <h3 className="text-lg font-semibold">International delivery</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Duties and taxes are shown at checkout. We partner with DHL Express for global shipments.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
