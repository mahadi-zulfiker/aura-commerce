import Image from "next/image";
import Link from "next/link";
import { RefreshCcw, ShieldCheck, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { imageBlurDataUrl } from "@/lib/placeholder";

const returnSteps = [
  {
    title: "Start your return",
    description: "Log into your dashboard, select the order, and request a return label.",
  },
  {
    title: "Pack it securely",
    description: "Use the original packaging or a sturdy box with cushioning.",
  },
  {
    title: "Drop it off",
    description: "Scan the QR code at any carrier location and keep the receipt.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <RefreshCcw className="h-4 w-4" />
            Easy returns
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Return or exchange with ease.</h1>
          <p className="text-muted-foreground text-lg">
            We offer 30-day returns on all standard purchases. Aura Care members enjoy 45 days and free return shipping.
          </p>
          <div className="flex gap-3">
            <Button variant="glow" asChild>
              <Link href="/dashboard/orders">Start a return</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Need help?</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-72 lg:h-[380px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
          <Image
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80"
            alt="Aura Commerce returns"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {returnSteps.map((step) => (
          <Card key={step.title} className="border-border/60">
            <CardContent className="space-y-3">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Quality checks",
            description: "Returns are inspected within 3 business days to process refunds quickly.",
          },
          {
            icon: PackageOpen,
            title: "Exchange priority",
            description: "Exchanges are reserved first, so your replacement ships sooner.",
          },
          {
            icon: RefreshCcw,
            title: "Refund timing",
            description: "Refunds appear 5-10 business days after inspection.",
          },
        ].map((item) => (
          <Card key={item.title} className="border-border/60">
            <CardContent className="space-y-3">
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
