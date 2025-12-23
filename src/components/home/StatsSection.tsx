export function StatsSection() {
    const stats = [
        { label: "Active Users", value: "250K+" },
        { label: "Products Sold", value: "1.2M+" },
        { label: "Positive Reviews", value: "98%" },
        { label: "Countries Served", value: "50+" },
    ];

    return (
        <section className="py-16 lg:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-left" />
            <div className="container relative mx-auto px-4 text-center">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="space-y-2">
                            <p className="text-4xl lg:text-5xl font-display font-bold gradient-text">
                                {stat.value}
                            </p>
                            <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
