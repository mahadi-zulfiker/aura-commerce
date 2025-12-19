"use client";

import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { imageBlurDataUrl } from "@/lib/placeholder";

const faqItems = [
  {
    category: "Orders",
    question: "How fast do you process new orders?",
    answer:
      "Orders placed before 2 PM PT ship the same business day. You can track progress from your dashboard or the confirmation email.",
  },
  {
    category: "Shipping",
    question: "Do you offer international delivery?",
    answer:
      "Yes. We ship to over 35 countries with duties calculated at checkout. Delivery ranges from 5-12 business days depending on region.",
  },
  {
    category: "Returns",
    question: "What is your return window?",
    answer:
      "You have 30 days to return or exchange any purchase. Aura Care members get a 45-day window with free return shipping.",
  },
  {
    category: "Warranty",
    question: "Is a warranty included with every purchase?",
    answer:
      "Every device includes a 2-year Aura warranty. Extended protection is available at checkout for select categories.",
  },
  {
    category: "Payments",
    question: "Which payment methods do you accept?",
    answer:
      "We accept all major credit cards, Apple Pay, Google Pay, and Shop Pay. Bank transfer is available for enterprise orders.",
  },
  {
    category: "Membership",
    question: "What is Aura Care?",
    answer:
      "Aura Care is our membership for faster shipping, concierge support, and early access to limited releases.",
  },
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16 space-y-12">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-5">
          <Badge variant="category" className="w-fit">
            Support center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold">Answers to help you move faster.</h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Everything you need to know about orders, shipping, and care. If you are still unsure, our team is ready to
            walk you through it.
          </p>
          <div className="flex flex-wrap gap-3">
            {["Orders", "Shipping", "Returns", "Warranty"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-border/60 bg-background px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative h-72 lg:h-[380px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
            alt="Aura Commerce support workspace"
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={imageBlurDataUrl}
          />
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Accordion type="single" collapsible className="rounded-2xl border border-border/60 bg-background/70 p-6">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger>
                  <div className="text-left">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.category}</span>
                    <p className="text-base font-semibold">{item.question}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Still need help?</h3>
              <p className="text-sm text-muted-foreground">
                Share your question and we will connect you with the right specialist within 24 hours.
              </p>
              <Button variant="glow" asChild>
                <Link href="/contact">Contact support</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Concierge hours</h3>
              <p className="text-sm text-muted-foreground">
                Mon - Sun, 9:00am to 9:00pm PT. Priority support for Aura Care members.
              </p>
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                Pro tip: include your order number to speed up resolutions.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
