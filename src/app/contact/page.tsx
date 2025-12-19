"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, MapPin, Phone, Clock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { imageBlurDataUrl } from "@/lib/placeholder";

const contactSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    topic: z.string().min(1, "Select a topic"),
    orderNumber: z.string().optional(),
    message: z.string().min(10, "Tell us a bit more"),
  })
  .superRefine((data, ctx) => {
    if (data.topic === "order" && !data.orderNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Order number is required for order support.",
        path: ["orderNumber"],
      });
    }
  });

type ContactForm = z.infer<typeof contactSchema>;

const contactTopics = [
  { value: "order", label: "Order support" },
  { value: "product", label: "Product question" },
  { value: "partnerships", label: "Partnerships" },
  { value: "press", label: "Press + media" },
  { value: "other", label: "Something else" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      topic: "",
    },
  });

  const topic = watch("topic");

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to send your message.");
      }

      toast.success("Message sent", {
        description: "Our concierge team will reach out within 24 hours.",
      });
      reset();
    } catch (error: any) {
      toast.error("Something went wrong", {
        description: error.message || "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container relative mx-auto px-4 py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Concierge support
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                Let us tune the details so your setup feels effortless.
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Whether you need help with an order, want a product recommendation, or are exploring
                partnerships, our team is ready to help.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Live response",
                    description: "Expect a reply within 24 hours, 7 days a week.",
                  },
                  {
                    title: "Personalized help",
                    description: "A dedicated specialist follows your request from start to finish.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/50 bg-background/80 p-4">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-72 lg:h-[420px] rounded-3xl overflow-hidden border border-border/50 bg-muted/30">
              <Image
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80"
                alt="Aura Commerce support team"
                fill
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL={imageBlurDataUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-border/60">
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold">Send us a message</h2>
                <p className="text-muted-foreground text-sm">
                  Share the details and we will match you with the right specialist.
                </p>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" placeholder="Avery Parker" {...register("name")} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="you@email.com" {...register("email")} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Controller
                    control={control}
                    name="topic"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactTopics.map((topicItem) => (
                            <SelectItem key={topicItem.value} value={topicItem.value}>
                              {topicItem.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.topic && <p className="text-xs text-destructive">{errors.topic.message}</p>}
                </div>

                {topic === "order" && (
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">Order number</Label>
                    <Input id="orderNumber" placeholder="AURA-2024-0192" {...register("orderNumber")} />
                    {errors.orderNumber && (
                      <p className="text-xs text-destructive">{errors.orderNumber.message}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">How can we help?</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your request, timeline, or the product you are eyeing."
                    className="min-h-[140px]"
                    {...register("message")}
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                </div>

                <Button type="submit" variant="glow" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/60">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">Direct channels</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>hello@auracommerce.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Market Street, San Francisco, CA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Mon - Sun, 9:00am - 9:00pm PT</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">Request types we handle</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>Product sourcing, bundles, and personalized recommendations.</li>
                  <li>Order edits, delivery updates, and warranty claims.</li>
                  <li>Wholesale, gifting, and corporate partnerships.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
