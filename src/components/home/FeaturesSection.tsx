import { Truck, Shield, Headphones, RefreshCcw } from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: <Truck className="h-8 w-8 text-primary" />,
            title: "Global Shipping",
            description: "Fast and reliable delivery to over 100 countries worldwide.",
        },
        {
            icon: <Shield className="h-8 w-8 text-primary" />,
            title: "Secure Payments",
            description: "Your data is protected with industry-standard encryption.",
        },
        {
            icon: <Headphones className="h-8 w-8 text-primary" />,
            title: "24/7 Support",
            description: "Our concierge team is always here to help you out.",
        },
        {
            icon: <RefreshCcw className="h-8 w-8 text-primary" />,
            title: "Easy Returns",
            description: "30-day hassle-free return policy for your peace of mind.",
        },
    ];

    return (
        <section className="py-16 lg:py-24 bg-aura-surface/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="mb-4 p-3 rounded-xl bg-primary/10">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
