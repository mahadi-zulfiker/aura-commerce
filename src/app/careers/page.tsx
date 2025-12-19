import Image from "next/image";
import Link from "next/link";
import { Briefcase, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { imageBlurDataUrl } from "@/lib/placeholder";

const roles = [
  {
    title: "Customer Experience Lead",
    team: "Support",
    location: "Remote - US",
    type: "Full-time",
  },
  {
    title: "Growth Marketing Manager",
    team: "Marketing",
    location: "San Francisco, CA",
    type: "Full-time",
  },
  {
    title: "Vendor Partnerships Specialist",
    team: "Operations",
    location: "Remote - Global",
    type: "Contract",
  },
];

const benefits = [
  "Flexible remote-first culture with quarterly studio retreats.",
  "Annual wellness stipend and curated tech allowance.",
  "Professional development budget and mentorship.",
  "Generous parental leave and flexible time off.",
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Careers at Aura
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Build the calmest commerce experience.</h1>
          <p className="text-muted-foreground text-lg">
            We are a team of designers, technologists, and operators obsessed with making tech feel effortless. Join us
            in shaping the future of curated commerce.
          </p>
          <div className="flex gap-3">
            <Button variant="glow" asChild>
              <Link href="/contact">Introduce yourself</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">Our story</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-72 lg:h-[380px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80"
            alt="Aura Commerce team collaboration"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Briefcase className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Benefits</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-semibold">How we work</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              We are remote-first with hubs in San Francisco and Berlin. Teams meet quarterly for planning, product
              sprints, and community time.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-display font-bold">Open roles</h2>
          <Badge variant="category">Updated weekly</Badge>
        </div>
        <div className="grid gap-4">
          {roles.map((role) => (
            <Card key={role.title} className="border-border/60">
              <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{role.title}</p>
                  <p className="text-sm text-muted-foreground">{role.team}</p>
                </div>
                <div className="text-sm text-muted-foreground">{role.location}</div>
                <Badge variant="outline">{role.type}</Badge>
                <Button variant="outline" asChild>
                  <Link href="/contact">Apply</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
