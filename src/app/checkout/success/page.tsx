"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Successful!</h1>
            <p className="text-muted-foreground max-w-md">
                Thank you for your purchase. Your order has been confirmed and will be shipped shortly.
            </p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/dashboard/orders">View Order</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    );
}
