"use client";

import { useMemo, useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { useAuthStore } from "@/store/auth";
import { apiPatch, apiPost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];
const vendorStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function OrdersPage() {
  const { user } = useAuthStore();
  const role = user?.role ?? "USER";
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [trackingDrafts, setTrackingDrafts] = useState<
    Record<string, { carrier: string; trackingNumber: string }>
  >({});

  const { data, isLoading, refetch } = useOrders(page, 10);

  const orders = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.items?.some((item) =>
          item.productName.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
      const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, paymentFilter, search, statusFilter]);

  const updateStatus = async (orderId: string, status: string) => {
    setActionId(orderId);
    try {
      await apiPatch(`/orders/${orderId}/status`, { status });
      toast.success("Order updated");
      refetch();
    } catch (error: any) {
      toast.error("Unable to update order", {
        description: error.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  const refundOrder = async (orderId: string) => {
    setActionId(orderId);
    try {
      await apiPost("/payments/refund", { orderId });
      toast.success("Refund initiated");
      refetch();
    } catch (error: any) {
      toast.error("Refund failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  const updateTracking = async (orderId: string) => {
    const draft = trackingDrafts[orderId];
    if (!draft?.carrier && !draft?.trackingNumber) {
      toast.error("Tracking details required", {
        description: "Provide a carrier or tracking number.",
      });
      return;
    }

    setActionId(orderId);
    try {
      await apiPatch(`/orders/${orderId}/tracking`, {
        carrier: draft?.carrier || undefined,
        trackingNumber: draft?.trackingNumber || undefined,
      });
      toast.success("Tracking updated");
      refetch();
    } catch (error: any) {
      toast.error("Unable to update tracking", {
        description: error.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    setActionId(orderId);
    try {
      await apiPost(`/orders/${orderId}/cancel`, {});
      toast.success("Order cancelled");
      refetch();
    } catch (error: any) {
      toast.error("Unable to cancel order", {
        description: error.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  const statusOptions = role === "VENDOR" ? vendorStatuses : orderStatuses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {role === "ADMIN" ? "All Orders" : "Orders"}
        </h1>
        <p className="text-muted-foreground">
          {role === "ADMIN"
            ? "Monitor payments, fulfillment, and refunds in one place."
            : "Track and manage your recent orders."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Order number or product"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Order status</label>
            <select
              className="h-10 rounded-lg border border-border bg-muted/40 px-3 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment status</label>
            <select
              className="h-10 rounded-lg border border-border bg-muted/40 px-3 text-sm"
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
            >
              <option value="">All payments</option>
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order history</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <OrdersSkeleton />
          ) : filteredOrders.length === 0 ? (
            <div className="text-sm text-muted-foreground">No orders match these filters.</div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
                const canRefund =
                  role === "ADMIN" && order.paymentStatus === "PAID" && order.orderStatus !== "REFUNDED";
                const canCancel =
                  role === "USER" &&
                  ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.orderStatus) &&
                  order.paymentStatus !== "PAID";
                const trackingDraft = trackingDrafts[order.id] ?? {
                  carrier: order.carrier ?? "",
                  trackingNumber: order.trackingNumber ?? "",
                };
                return (
                  <div key={order.id} className="border rounded-xl p-4 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">Order</p>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          Placed {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{order.orderStatus}</Badge>
                        <Badge variant="secondary">{order.paymentStatus}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{itemCount} items</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {order.shop?.name && (
                          <p>
                            <span className="text-foreground font-medium">Shop:</span> {order.shop.name}
                          </p>
                        )}
                        {order.address && (
                          <p>
                            <span className="text-foreground font-medium">Ship to:</span>{" "}
                            {order.address.fullName}, {order.address.city}
                          </p>
                        )}
                        {order.couponCode && (
                          <p>
                            <span className="text-foreground font-medium">Coupon:</span> {order.couponCode}
                          </p>
                        )}
                        {order.trackingNumber && (
                          <p>
                            <span className="text-foreground font-medium">Tracking:</span>{" "}
                            {order.carrier ? `${order.carrier} · ` : ""}
                            {order.trackingNumber}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${(order.subtotal ?? order.total).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>${(order.shippingCost ?? 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount</span>
                          <span>-${(order.discount ?? 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {order.items?.length ? (
                      <div className="rounded-lg bg-muted/30 p-3 text-sm">
                        <p className="text-xs uppercase text-muted-foreground mb-2">Items</p>
                        <div className="space-y-2">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <span className="text-foreground">
                                {item.productName} x{item.quantity}
                              </span>
                              <span>${item.total.toFixed(2)}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{order.items.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null}

                    {role !== "USER" && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-3 items-center">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Update status</span>
                            <select
                              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                              value={order.orderStatus}
                              onChange={(event) => updateStatus(order.id, event.target.value)}
                              disabled={actionId === order.id}
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                          {canRefund && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => refundOrder(order.id)}
                              disabled={actionId === order.id}
                            >
                              Refund
                            </Button>
                          )}
                        </div>
                        <div className="rounded-lg border border-border/60 p-3 space-y-3">
                          <p className="text-xs uppercase text-muted-foreground">Tracking</p>
                          <div className="grid gap-3 md:grid-cols-2">
                            <Input
                              placeholder="Carrier"
                              value={trackingDraft.carrier}
                              onChange={(event) =>
                                setTrackingDrafts((prev) => ({
                                  ...prev,
                                  [order.id]: {
                                    ...trackingDraft,
                                    carrier: event.target.value,
                                  },
                                }))
                              }
                              disabled={actionId === order.id}
                            />
                            <Input
                              placeholder="Tracking number"
                              value={trackingDraft.trackingNumber}
                              onChange={(event) =>
                                setTrackingDrafts((prev) => ({
                                  ...prev,
                                  [order.id]: {
                                    ...trackingDraft,
                                    trackingNumber: event.target.value,
                                  },
                                }))
                              }
                              disabled={actionId === order.id}
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => updateTracking(order.id)}
                            disabled={actionId === order.id}
                          >
                            Save tracking
                          </Button>
                        </div>
                      </div>
                    )}

                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelOrder(order.id)}
                        disabled={actionId === order.id}
                      >
                        Cancel order
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border rounded-xl p-4 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="space-y-2 md:text-right">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>

          <div className="rounded-lg bg-muted/30 p-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      ))}
    </div>
  );
}
