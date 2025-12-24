"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { useOrders } from "@/hooks/use-orders";
import { useReturns } from "@/hooks/use-returns";
import { apiPatch, apiPost } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  RotateCcw,
  Package,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ChevronDown,
  Plus,
  ShieldCheck,
  Undo2,
  ListRestart,
  CreditCard,
  Box,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusOptionsAdmin = ["REQUESTED", "APPROVED", "REJECTED", "RECEIVED", "REFUNDED"];
const statusOptionsVendor = ["REQUESTED", "APPROVED", "REJECTED", "RECEIVED"];
const returnReasons = ["Damaged item", "Wrong item", "Missing parts", "Quality issue", "Other"];

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
      toast.error("Protocol initialization failed", { description: "Select an eligible order node." });
      return;
    }
    setActionId("create");
    try {
      await apiPost("/returns", { orderId: selectedOrder, reason, note: note.trim() || undefined });
      toast.success("Return protocol initiated");
      setSelectedOrder("");
      setReason(returnReasons[0]);
      setNote("");
      refetch();
    } catch (error: any) {
      toast.error("Initialization failure");
    } finally {
      setActionId(null);
    }
  };

  const updateStatus = async (returnId: string, status: string) => {
    setActionId(returnId);
    try {
      await apiPatch(`/returns/${returnId}/status`, { status });
      toast.success("Protocol state synchronized");
      refetch();
    } catch (error: any) {
      toast.error("Synchronization failure");
    } finally {
      setActionId(null);
    }
  };

  const cancelReturn = async (returnId: string) => {
    setActionId(returnId);
    try {
      await apiPost(`/returns/${returnId}/cancel`, {});
      toast.success("Return protocol terminated");
      refetch();
    } catch (error: any) {
      toast.error("Termination failed");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <RotateCcw className="h-3 w-3" />
            Reverse Logistics
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Return <span className="text-primary italic">Protocols.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">
            {role === "USER"
              ? "Initiate asset return protocols and monitor synchronization progress."
              : "Review incoming return transmissions and coordinate financial settlements."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Protocol Initiation */}
        {role === "USER" && (
          <div className="xl:col-span-12 2xl:col-span-5">
            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-primary/10">
                  <Undo2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-white italic">Node Return</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Reverse Logistics Trigger</p>
                </div>
              </div>

              {deliveredOrders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Zero eligible orders detected</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Select Target Order</Label>
                    <div className="relative">
                      <select
                        className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all"
                        value={selectedOrder}
                        onChange={(e) => setSelectedOrder(e.target.value)}
                      >
                        <option value="" className="bg-slate-900">Select Order Hub</option>
                        {deliveredOrders.map(o => <option key={o.id} value={o.id} className="bg-slate-900">{o.orderNumber} · {new Date(o.createdAt).toLocaleDateString()}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Reason for Disconnect</Label>
                      <div className="relative">
                        <select
                          className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest text-white/60 appearance-none focus:border-primary/50 focus:outline-none transition-all"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        >
                          {returnReasons.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-2">Protocol Notes</Label>
                      <Input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Details regarding failure state..."
                        className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-medium focus:border-primary/50 placeholder:text-white/10"
                      />
                    </div>
                  </div>

                  <Button onClick={submitReturn} disabled={actionId === "create"} className="w-full h-16 rounded-3xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    {actionId === "create" ? <Loader2 className="animate-spin h-5 w-5" /> : <><ListRestart className="mr-3 h-4 w-4" /> Initialize Return Protocol</>}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transmission Registry */}
        <div className={cn("xl:col-span-12", role === "USER" ? "2xl:col-span-7" : "")}>
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-black text-white italic uppercase tracking-widest">Protocol Registry</h3>
              <Badge className="bg-white/5 text-white/30 border-none px-2 rounded-md h-5 text-[8px] font-black">{returns.length} TRANSMISSIONS</Badge>
            </div>

            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 rounded-[2rem] bg-white/5 animate-pulse" />)
            ) : returns.length === 0 ? (
              <div className="py-24 text-center rounded-[3rem] bg-white/[0.01] border border-dashed border-white/10">
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Zero transmissions detected</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {returns.map((request) => (
                  <div key={request.id} className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-primary relative overflow-hidden">
                          <Box className="h-8 w-8 relative z-10" />
                          <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-xl font-display font-black text-white">{request.order.orderNumber}</h4>
                            <Badge className={cn(
                              "text-[8px] font-black px-2 h-4 border-none",
                              request.status === "REFUNDED" ? "bg-emerald-500/10 text-emerald-500" :
                                request.status === "REQUESTED" ? "bg-primary/10 text-primary border border-primary/20" :
                                  "bg-white/5 text-white/30"
                            )}>
                              {request.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-[10px] font-black uppercase tracking-widest text-white/20">
                            <p className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {new Date(request.createdAt).toLocaleDateString()}</p>
                            <p className="flex items-center gap-1.5 text-primary/60"><CreditCard className="h-3 w-3" /> ${request.order.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2 shrink-0">
                        {role !== "USER" && (
                          <div className="relative group/select">
                            <select
                              className="h-10 rounded-xl bg-slate-900 border border-white/10 px-4 pr-10 text-[10px] font-black uppercase tracking-widest text-white appearance-none focus:border-primary/50 transition-all cursor-pointer"
                              value={request.status}
                              onChange={(e) => updateStatus(request.id, e.target.value)}
                              disabled={actionId === request.id}
                            >
                              {statusOptions.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20 pointer-events-none group-hover/select:text-primary transition-colors" />
                          </div>
                        )}
                        {role === "USER" && request.status === "REQUESTED" && (
                          <button
                            onClick={() => cancelReturn(request.id)}
                            disabled={actionId === request.id}
                            className="h-10 px-6 rounded-xl bg-destructive/10 hover:bg-destructive text-destructive hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            Abort Transmission
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-4 w-4 text-white/20" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Reasoning Hub</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                          <p className="text-xs font-bold text-white/80">{request.reason}</p>
                          {request.note && (
                            <p className="text-[10px] font-medium text-white/40 leading-relaxed italic border-t border-white/5 pt-2">{request.note}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-white/20" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Asset Manifest ({request.items.length})</span>
                        </div>
                        <div className="space-y-2">
                          {request.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-[11px] font-bold text-white/60 bg-white/5 px-4 h-10 rounded-xl">
                              <span className="truncate max-w-[150px]">{item.orderItem.productName}</span>
                              <span className="text-primary">x{item.quantity}</span>
                            </div>
                          ))}
                          {request.items.length > 2 && (
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 text-center">+ {request.items.length - 2} Additional Assets</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-10">
                <Button variant="ghost" className="h-11 rounded-xl text-white/20 hover:text-white text-[9px] font-black uppercase tracking-widest" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Registry Previous
                </Button>
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Page {page} of {totalPages}</span>
                <Button variant="ghost" className="h-11 rounded-xl text-white/20 hover:text-white text-[9px] font-black uppercase tracking-widest" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  Registry Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
