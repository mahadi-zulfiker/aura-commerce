"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { apiPost } from "@/lib/api";
import { Loader2 } from "lucide-react";

import { useCartStore } from "@/store/cart";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const { getTotalPrice } = useCartStore();
    const amount = getTotalPrice(); // Get real total
    const [clientSecret, setClientSecret] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (amount <= 0) {
            return;
        }

        // Create PaymentIntent as soon as the page loads
        setIsLoading(true);
        apiPost<{ client_secret: string }>("payments/create-intent", { amount })
            .then((data) => {
                setClientSecret(data.client_secret);
            })
            .catch((err) => {
                console.error("Error fetching payment intent:", err);
                setErrorMessage(err.message || "Failed to initialize payment.");
            })
            .finally(() => setIsLoading(false));
    }, [amount]);

    const appearance = {
        theme: 'stripe' as const,
    };
    const options = {
        clientSecret,
        appearance,
    };

    if (amount <= 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">Add components to your cart to proceed with checkout.</p>
                <Button asChild>
                    <Link href="/products">Browse Products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    {/* Shipping Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                            <CardDescription>Enter your delivery details.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input id="first-name" placeholder="Max" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input id="last-name" placeholder="Robinson" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" placeholder="123 Example St" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" placeholder="San Francisco" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="zip">Zip Code</Label>
                                    <Input id="zip" placeholder="94103" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>Secure payment powered by Stripe.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {clientSecret ? (
                                <Elements options={options} stripe={stripePromise}>
                                    <PaymentForm amount={amount} />
                                </Elements>
                            ) : errorMessage ? (
                                <div className="text-center p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <p>Error: {errorMessage}</p>
                                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[200px]">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-2">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${amount}.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span>$10.00</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Tax</span>
                                <span>$18.00</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${amount}.00</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
