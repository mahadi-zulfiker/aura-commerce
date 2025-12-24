"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Mail } from "lucide-react";
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
        <section className="py-24 lg:py-40 relative overflow-hidden">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-slate-950" />
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] translate-y-1/2" />
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-16 lg:p-24 overflow-hidden relative group">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                            <Mail className="h-64 w-64 -rotate-12 translate-x-12 -translate-y-12" />
                        </div>

                        <div className="max-w-2xl relative z-10 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground mb-8">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-xs font-bold uppercase tracking-widest">Join the Inner Circle</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-8 tracking-tighter leading-none">
                                Tech <span className="text-primary italic">Updates</span>, <br />
                                Delivered Weekly.
                            </h2>

                            <p className="text-xl text-white/60 mb-12 leading-relaxed">
                                Join 50,000+ tech enthusiasts getting early access to drops, exclusive curated essentials, and deep-dives into future tech.
                            </p>

                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="h-16 bg-white/[0.05] border-white/10 focus:border-primary/50 text-white text-lg rounded-2xl px-6 min-w-[300px]"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button size="xl" type="submit" disabled={isSubmitting} className="rounded-2xl h-16 px-10 bg-primary hover:bg-primary-glow text-white font-black uppercase tracking-widest text-base shadow-2xl shadow-primary/20">
                                    {isSubmitting ? "Subscribing..." : (
                                        <>
                                            Join Now <Send className="h-5 w-5 ml-3" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <p className="text-sm text-white/30 mt-8 font-medium">
                                * We respect your privacy. No spam, ever.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

