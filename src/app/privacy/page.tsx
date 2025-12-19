import Image from "next/image";
import Link from "next/link";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { imageBlurDataUrl } from "@/lib/placeholder";

const sections = [
  {
    title: "Information we collect",
    description:
      "We collect account details, shipping information, and purchase history to fulfill orders and provide support.",
  },
  {
    title: "How we use data",
    description:
      "Your data powers order fulfillment, personalized recommendations, fraud prevention, and proactive service updates.",
  },
  {
    title: "Your choices",
    description:
      "You can update preferences, opt out of marketing emails, or request a copy of your data at any time.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Privacy policy
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Trust and clarity in every interaction.</h1>
          <p className="text-muted-foreground text-lg">
            We keep your data secure, only collect what we need, and never sell your information. Last updated: January
            2024.
          </p>
          <div className="flex gap-3">
            <Button variant="glow" asChild>
              <Link href="/contact">Privacy requests</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/terms">Terms of service</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-72 lg:h-[360px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
          <Image
            src="https://images.unsplash.com/photo-1508780709619-79562169bc64?w=1200&q=80"
            alt="Secure data handling"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="border-border/60">
            <CardContent className="space-y-3">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Lock className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Security practices</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              We encrypt sensitive data in transit, restrict access based on role, and review third-party vendors for
              compliance.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="space-y-3">
            <h3 className="text-lg font-semibold">Contact our privacy team</h3>
            <p className="text-sm text-muted-foreground">
              Email privacy@auracommerce.com for data access, deletion, or compliance requests.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
