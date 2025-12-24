"use client";

import { motion } from "framer-motion";
import { Truck, Shield, Headphones, RefreshCcw } from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: <Truck className="h-10 w-10 text-primary" />,
            title: "Global Shipping",
            description: "Fast and reliable delivery to over 100 countries worldwide.",
        },
        {
            icon: <Shield className="h-10 w-10 text-primary" />,
            title: "Secure Payments",
            description: "Your data is protected with industry-standard encryption.",
        },
        {
            icon: <Headphones className="h-10 w-10 text-primary" />,
            title: "24/7 Support",
            description: "Our concierge team is always here to help you out.",
        },
        {
            icon: <RefreshCcw className="h-10 w-10 text-primary" />,
            title: "Easy Returns",
            description: "30-day hassle-free return policy for your peace of mind.",
        },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-muted/20">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-border/40 bg-background/40 backdrop-blur-xl hover:bg-background/60 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className="mb-6 p-5 rounded-2xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-display font-black mb-3 tracking-tight">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Ambient background accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/[0.02] blur-[150px] -z-10" />
        </section>
    );
}

