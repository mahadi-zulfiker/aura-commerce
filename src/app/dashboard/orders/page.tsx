"use client";

import { useMemo, useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { useAuthStore } from "@/store/auth";
import { apiPatch, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ShoppingBag,
  Search,
  Filter,
  ChevronRight,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  CreditCard,
  MapPin,
  ExternalLink,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const orderStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function OrdersPage() {
  const { user } = useAuthStore();
  const role = user?.role ?? "USER";
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const { data, isLoading, refetch } = useOrders(page, 10);
  const orders = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;

  const toggleExpand = (id: string) => {
    const next = new Set(expandedOrders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedOrders(next);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = !search || order.orderNumber.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
      const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, paymentFilter, search, statusFilter]);

  const updateStatus = async (orderId: string, status: string) => {
    setActionId(orderId);
    try {
      await apiPatch(`/orders/${orderId}/status`, { status });
      toast.success("Logistics updated");
      refetch();
    } catch (error: any) {
      toast.error("Operation failed");
    } finally {
      setActionId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className="h-4 w-4" />;
      case "SHIPPED": return <Truck className="h-4 w-4" />;
      case "DELIVERED": return <CheckCircle2 className="h-4 w-4" />;
      case "CANCELLED": return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Truck className="h-3 w-3" />
            Logistic Matrix
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Order <span className="text-primary italic">Tracking.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Real-time telemetry for all fulfillment operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-xs font-black uppercase tracking-widest focus:border-primary/50 transition-all placeholder:text-white/10"
          />
        </div>
        <div className="relative">
          <select
            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="" className="bg-slate-900">All Operations</option>
            {orderStatuses.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="" className="bg-slate-900">All Payments</option>
            {paymentStatuses.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />)
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10">
            <p className="text-white/20 text-xs font-black uppercase tracking-[0.2em]">Zero entities detected</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div key={order.id} className="group overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500">
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full text-left p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-primary">
                      {getStatusIcon(order.orderStatus)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Entity #{order.orderNumber.slice(-8)}</p>
                      <h3 className="text-lg font-display font-black text-white group-hover:text-primary transition-colors">
                        {order.items?.[0]?.productName || "Direct Transaction"}
                        {order.items && order.items.length > 1 && <span className="text-white/30 ml-2">+{order.items.length - 1} more assets</span>}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col items-end px-4 border-r border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Status</p>
                      <Badge className="mt-1 bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest">{order.orderStatus}</Badge>
                    </div>
                    <div className="flex flex-col items-end px-4 border-r border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Value</p>
                      <p className="text-lg font-display font-black text-white">${order.total.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end pl-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Timestamp</p>
                      <p className="text-xs font-bold text-white/60">{new Date(order.createdAt!).toLocaleDateString()}</p>
                    </div>
                    <div className={cn("ml-4 p-2 rounded-xl bg-white/5 transition-transform duration-500", isExpanded ? "rotate-180" : "")}>
                      <ChevronDown className="h-4 w-4 text-white/20" />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-8 pb-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-white/5">
                      {/* Details */}
                      <div className="lg:col-span-7 space-y-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Node Components</p>
                          <div className="space-y-3">
                            {order.items?.map(item => (
                              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-xl bg-white/5 overflow-hidden">
                                    {/* Placeholder for image */}
                                    <div className="w-full h-full bg-slate-800" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-white">{item.productName}</p>
                                    <p className="text-[10px] uppercase text-white/30">Quantity: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="text-sm font-display font-black text-white">${item.total.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Destination Node</p>
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-white">{order.address?.fullName || "Aura Recipient"}</p>
                                <p className="text-[10px] text-white/40 leading-relaxed mt-1">{order.address?.street}, {order.address?.city}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Financial Protocol</p>
                            <div className="flex items-start gap-3">
                              <CreditCard className="h-4 w-4 text-accent mt-1 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-white">{order.paymentStatus}</p>
                                <p className="text-[10px] text-white/40 mt-1">Transaction Verified</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary & Actions */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Financial Summary</p>
                          <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold text-white/60">
                              <span>Base Value</span>
                              <span>${(order.subtotal || order.total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-white/60">
                              <span>Logistics Protocol</span>
                              <span>${(order.shippingCost || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-accent">
                              <span>Discount Token</span>
                              <span>-${(order.discount || 0).toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-primary/20 my-2" />
                            <div className="flex justify-between items-end">
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Final Settlement</span>
                              <span className="text-2xl font-display font-black text-white">${order.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {role !== "USER" && (
                            <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2">Administrative Actions</p>
                              <div className="grid grid-cols-2 gap-3">
                                <select
                                  className="h-12 bg-white/5 border border-white/5 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-white/60 focus:border-primary/50 transition-all appearance-none"
                                  onChange={(e) => updateStatus(order.id, e.target.value)}
                                  value={order.orderStatus}
                                >
                                  {orderStatuses.map(s => <option key={s} value={s} className="bg-slate-950">{s}</option>)}
                                </select>
                                <Button variant="outline" className="h-12 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                                  Sync API
                                </Button>
                              </div>
                            </div>
                          )}
                          <Button className="h-14 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Invoice Transmission
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-10">
          <Button
            variant="ghost"
            className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 text-white disabled:opacity-20"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
            Node {page} of {totalPages}
          </span>
          <Button
            variant="ghost"
            className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 text-white disabled:opacity-20"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
