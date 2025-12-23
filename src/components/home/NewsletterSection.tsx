"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

export function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsSubmitting(true);
        try {
            await apiPost("/newsletter/subscribe", { email });
            toast.success("Subscribed successfully!", {
                description: "Welcome to the Aura Commerce newsletter.",
            });
            setEmail("");
        } catch (error: any) {
            toast.error(error.message || "Failed to subscribe. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-20 lg:py-32 relative overflow-hidden bg-primary/10">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] -translate-y-1/2" />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/20 text-primary animate-fade-in">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-medium">Join our community</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                        Stay in the <span className="gradient-text">vibe</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get early access to drops, exclusive curated tech essentials, and calm-living stories delivered to your inbox.
                    </p>

                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="h-12 bg-background/80 border-border/50 focus:border-primary/50 text-lg rounded-xl"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button size="xl" variant="glow" type="submit" disabled={isSubmitting} className="rounded-xl">
                            {isSubmitting ? "Subscribing..." : (
                                <>
                                    Subscribe <Send className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                    <p className="text-xs text-muted-foreground">
                        No spam, just quality. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    );
}
