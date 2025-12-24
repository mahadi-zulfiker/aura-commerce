"use client";

import { motion } from "framer-motion";

export function StatsSection() {
    const stats = [
        { label: "Active Users", value: "250K+" },
        { label: "Products Sold", value: "1.2M+" },
        { label: "Positive Reviews", value: "98%" },
        { label: "Countries Served", value: "50+" },
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-slate-950">
            {/* Animated background stripes */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>

            <div className="container relative mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="text-center group"
                        >
                            <p className="text-5xl lg:text-7xl font-display font-black text-white mb-3 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                                {stat.value}
                            </p>
                            <div className="w-12 h-1 bg-primary mx-auto mb-4 rounded-full" />
                            <p className="text-primary-foreground/50 font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

