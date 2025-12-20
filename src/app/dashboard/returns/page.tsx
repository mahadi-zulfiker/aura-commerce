"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useOrders } from "@/hooks/use-orders";
import { useReturns } from "@/hooks/use-returns";
import { apiPatch, apiPost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const statusOptionsAdmin = [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "RECEIVED",
  "REFUNDED",
];

const statusOptionsVendor = ["REQUESTED", "APPROVED", "REJECTED", "RECEIVED"];

const returnReasons = [
  "Damaged item",
  "Wrong item",
  "Missing parts",
  "Quality issue",
  "Other",
];

export default function ReturnsPage() {
  const { user } = useAuthStore();
  const role = user?.role ?? "USER";
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState(returnReasons[0]);
  const [note, setNote] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const { data: ordersData } = useOrders(1, 50);
  const { data: returnsData, isLoading, refetch } = useReturns(page, 10);

  const deliveredOrders = useMemo(
    () => ordersData?.data.filter((order) => order.orderStatus === "DELIVERED") ?? [],
    [ordersData?.data],
  );

  const returns = returnsData?.data ?? [];
  const totalPages = returnsData?.meta.totalPages ?? 1;

  const statusOptions = role === "ADMIN" ? statusOptionsAdmin : statusOptionsVendor;

  const submitReturn = async () => {
    if (!selectedOrder) {
      toast.error("Select an order", {
        description: "Choose a delivered order to return.",
      });
      return;
    }

    setActionId("create");
    try {
      await apiPost("/returns", {
        orderId: selectedOrder,
        reason,
        note: note.trim() || undefined,
      });
      toast.success("Return requested", {
        description: "We will review your request shortly.",
      });
      setSelectedOrder("");
      setReason(returnReasons[0]);
      setNote("");
      refetch();
    } catch (error: any) {
      toast.error("Unable to request return", {
        description: error.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  const updateStatus = async (returnId: string, status: string) => {
    setActionId(returnId);
    try {
      await apiPatch(`/returns/${returnId}/status`, { status });
      toast.success("Return updated");
      refetch();
    } catch (error: any) {
      toast.error("Unable to update return", {
        description: error.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  const cancelReturn = async (returnId: string) => {
    setActionId(returnId);
    try {
      await apiPost(`/returns/${returnId}/cancel`, {});
      toast.success("Return cancelled");
      refetch();
    } catch (error: any) {
      toast.error("Unable to cancel return", {
        description: error.message || "Please try again.",
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Returns</h1>
        <p className="text-muted-foreground">
          {role === "USER"
            ? "Request a return for delivered orders and track progress."
            : "Review return requests and coordinate refunds."}
        </p>
      </div>

      {role === "USER" && (
        <Card>
          <CardHeader>
            <CardTitle>Request a return</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deliveredOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You have no delivered orders eligible for returns yet.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="orderSelect">Delivered order</Label>
                  <select
                    id="orderSelect"
                    className="h-10 w-full rounded-lg border border-border bg-muted/40 px-3 text-sm"
                    value={selectedOrder}
                    onChange={(event) => setSelectedOrder(event.target.value)}
                    disabled={actionId === "create"}
                  >
                    <option value="">Select an order</option>
                    {deliveredOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.orderNumber} · {new Date(order.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="returnReason">Reason</Label>
                    <select
                      id="returnReason"
                      className="h-10 w-full rounded-lg border border-border bg-muted/40 px-3 text-sm"
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      disabled={actionId === "create"}
                    >
                      {returnReasons.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">Notes (optional)</Label>
                    <Input
                      id="note"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      disabled={actionId === "create"}
                    />
                  </div>
                </div>
                <Button onClick={submitReturn} disabled={actionId === "create"}>
                  Submit return request
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Return requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full" />
              ))}
            </div>
          ) : returns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No returns yet.</p>
          ) : (
            <div className="space-y-4">
              {returns.map((request) => (
                <div key={request.id} className="border rounded-xl p-4 space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase text-muted-foreground">Return</p>
                      <p className="font-semibold">{request.order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        Requested {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{request.status}</Badge>
                      {request.order.paymentStatus && (
                        <Badge variant="secondary">{request.order.paymentStatus}</Badge>
                      )}
                    </div>
                    {request.user && role !== "USER" && (
                      <div className="text-right text-sm text-muted-foreground">
                        {request.user.firstName || request.user.email}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
                    <div className="space-y-2">
                      <p>
                        <span className="text-foreground font-medium">Reason:</span> {request.reason}
                      </p>
                      {request.note && (
                        <p>
                          <span className="text-foreground font-medium">Note:</span> {request.note}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Items</span>
                        <span>{request.items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order total</span>
                        <span>${request.order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {request.items.length > 0 && (
                    <div className="rounded-lg bg-muted/30 p-3 text-sm">
                      <p className="text-xs uppercase text-muted-foreground mb-2">Items</p>
                      <div className="space-y-2">
                        {request.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-foreground">
                              {item.orderItem.productName} x{item.quantity}
                            </span>
                            <span>${item.orderItem.total.toFixed(2)}</span>
                          </div>
                        ))}
                        {request.items.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{request.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {role === "USER" && request.status === "REQUESTED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelReturn(request.id)}
                      disabled={actionId === request.id}
                    >
                      Cancel request
                    </Button>
                  )}

                  {role !== "USER" && (
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="text-muted-foreground">Update status</span>
                      <select
                        className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
                        value={request.status}
                        onChange={(event) => updateStatus(request.id, event.target.value)}
                        disabled={actionId === request.id}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
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
