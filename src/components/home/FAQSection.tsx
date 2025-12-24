"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Shipping typically takes 3-7 business days for domestic orders and 7-14 days for international orders depending on your location.",
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day hassle-free return policy. If you're not satisfied with your purchase, you can return it for a full refund or exchange.",
        },
        {
            question: "Do you offer international warranty?",
            answer: "Yes, all our flagship products come with a 2-year international warranty that covers manufacturing defects.",
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package in real-time.",
        },
    ];

    return (
        <section className="py-24 lg:py-32 relative overflow-hidden bg-background">
            {/* Subtle background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/[0.01] blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                            <HelpCircle className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Assistance</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-display font-black mb-4 tracking-tight">Got <span className="gradient-text">Questions?</span></h2>
                        <p className="text-lg text-muted-foreground">Everything you need to know about our service and processes.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-[2.5rem] p-6 md:p-12"
                    >
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="border-none bg-muted/20 rounded-2xl px-6 transition-all duration-300 data-[state=open]:bg-muted/40 data-[state=open]:shadow-lg"
                                >
                                    <AccordionTrigger className="text-left py-6 font-display font-bold text-lg hover:no-underline hover:text-primary transition-colors">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

