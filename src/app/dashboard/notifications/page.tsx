"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, MailOpen, Bell, Sparkles, Filter, ChevronLeft, ChevronRight, Activity, Zap, Info, AlertTriangle } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
    const [page, setPage] = useState(1);
    const {
        notifications,
        totalPages,
        isLoading,
        markAsRead,
        markAllAsRead,
    } = useNotifications(page, 20);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
                        <Activity className="h-3 w-3" />
                        Frequency Pulse
                    </div>
                    <h1 className="text-4xl font-display font-black tracking-tight text-white">
                        Global <span className="text-primary italic">Alerts.</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-1">Real-time synchronization of system events and personal transmissions.</p>
                </div>
                <Button
                    onClick={() => markAllAsRead.mutate()}
                    className="h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all px-8 group"
                >
                    <MailOpen className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                    Synchronize All (Clear)
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 rounded-[2rem] bg-white/5 animate-pulse" />)
                    ) : notifications.length === 0 ? (
                        <div className="py-24 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.01] animate-in fade-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-white/5 flex items-center justify-center mb-6 mx-auto">
                                <Bell className="h-8 w-8 text-white/5" />
                            </div>
                            <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">Zero Intervals</h3>
                            <p className="text-white/20 text-xs font-black uppercase tracking-widest mt-2">No active transmissions detected in this wavelength</p>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500">
                            {notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "group p-6 rounded-[2rem] border transition-all duration-500 flex items-start justify-between gap-6",
                                        item.isRead
                                            ? "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100"
                                            : "bg-primary/[0.03] border-primary/20 shadow-lg shadow-primary/5"
                                    )}
                                >
                                    <div className="flex items-start gap-6">
                                        <div className={cn(
                                            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all",
                                            item.isRead
                                                ? "bg-white/5 border-white/5 text-white/20"
                                                : "bg-primary/10 border-primary/20 text-primary"
                                        )}>
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-base font-display font-black text-white italic tracking-wider">{item.title}</h4>
                                                {!item.isRead && (
                                                    <Badge className="bg-primary text-white text-[8px] font-black uppercase px-2 h-4 border-none">NEW LINK</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-white/40 mt-1 leading-relaxed">{item.message}</p>
                                            <div className="flex items-center gap-4 mt-3">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-white/20">
                                                    {format(new Date(item.createdAt), "PPP p")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {!item.isRead && (
                                        <button
                                            onClick={() => markAsRead.mutate(item.id)}
                                            className="h-10 w-10 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition-all shrink-0 group/check"
                                        >
                                            <Check className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-10 px-4">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-20 flex items-center gap-2 transition-all">
                                <ChevronLeft className="h-4 w-4" /> Node Previous
                            </button>
                            <div className="h-10 px-6 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{page} / {totalPages}</span>
                            </div>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-20 flex items-center gap-2 transition-all">
                                Node Next <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/5 space-y-8 relative overflow-hidden group">
                        <div className="flex items-center gap-3">
                            <Filter className="h-5 w-5 text-primary" />
                            <h4 className="text-sm font-display font-black text-white uppercase tracking-widest">Signal Types</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center group/item cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover/item:text-white">Financial Protocols</span>
                                </div>
                                <Badge className="bg-white/5 text-white/30 border-none text-[8px]">Active</Badge>
                            </div>
                            <div className="flex justify-between items-center group/item cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover/item:text-white">Shipping Telemetry</span>
                                </div>
                                <Badge className="bg-white/5 text-white/30 border-none text-[8px]">Active</Badge>
                            </div>
                            <div className="flex justify-between items-center group/item cursor-pointer opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover/item:text-white">Security Intercepts</span>
                                </div>
                                <Badge className="bg-white/5 text-white/30 border-none text-[8px]">Offline</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <Info className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Protocol Tip</span>
                        </div>
                        <p className="text-[11px] font-medium text-indigo-400/80 leading-relaxed">
                            Synchronizing all alerts will clear your current visual pulse, moving all transmissions to the legacy registry.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
