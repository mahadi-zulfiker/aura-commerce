"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { apiGet } from "@/lib/api";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    apiGet<{ orderNumber: string; total: number }>(`/orders/${orderId}`)
      .then((data) => {
        setOrderNumber(data.orderNumber);
        setTotal(data.total);
      })
      .catch(() => {
        setOrderNumber(null);
      });
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Payment Successful!</h1>
      <p className="text-muted-foreground max-w-md">
        Thank you for your purchase. Your order has been confirmed and will be shipped shortly.
      </p>
      {orderNumber && (
        <div className="text-sm text-muted-foreground">
          Order <span className="font-semibold text-foreground">{orderNumber}</span>
          {total !== null && <span className="ml-2">• ${total.toFixed(2)}</span>}
        </div>
      )}
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard/orders">View Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
