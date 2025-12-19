import Image from "next/image";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Tech Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    content: "Aura Commerce has completely transformed my tech setup. The curation and support are unmatched. My new headphones are absolutely incredible!",
    rating: 5,
    product: "Studio Pro Wireless Headphones",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Professional Gamer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    content: "As a competitive gamer, I need reliable gear. The controller from Aura has the best response time I've ever experienced. Worth every penny!",
    rating: 5,
    product: "Pro Gaming Controller",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    content: "The UltraBook Pro handles all my video editing without breaking a sweat. Fast shipping and premium packaging. Highly recommend Aura!",
    rating: 5,
    product: "UltraBook Pro 16",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-aura-surface/60 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-2">
            What Our Customers <span className="gradient-text">Say</span>
          </h2>
          <p className="text-muted-foreground">
            Join thousands of satisfied customers worldwide
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/90 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Product Tag */}
              <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-4">
                {testimonial.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
                <div>
                  <p className="font-medium text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: "50K+", label: "Happy Customers" },
            { value: "4.9", label: "Average Rating" },
            { value: "100+", label: "Countries Served" },
            { value: "24/7", label: "Customer Support" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card/50 border border-border/30"
            >
              <p className="text-3xl lg:text-4xl font-display font-bold gradient-text">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


