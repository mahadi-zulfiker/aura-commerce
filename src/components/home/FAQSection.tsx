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
        <section className="py-16 lg:py-24 bg-aura-surface/30">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">Frequently Asked <span className="text-primary">Questions</span></h2>
                    <p className="text-muted-foreground">Everything you need to know about our service and processes.</p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-border/60">
                            <AccordionTrigger className="text-left font-display font-semibold hover:text-primary transition-colors">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
