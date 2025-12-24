"use client";

import { Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-8 space-y-12">
      <div className="relative group">
        <div className="absolute -inset-8 bg-primary/20 blur-[50px] rounded-full animate-pulse group-hover:bg-primary/30 transition-all duration-1000" />
        <div className="relative h-32 w-32 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden">
          <Zap className="h-10 w-10 text-primary animate-pulse" />

          {/* Decorative scanning line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-1/2 w-full -translate-y-full animate-[scan_2s_linear_infinite]" />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-primary">
          <Activity className="h-3 w-3" />
          Synchronizing Hub
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-2xl font-display font-black text-white italic tracking-wider">Aura <span className="text-primary italic">Dynamics.</span></h3>
          <div className="flex gap-1">
            <div className="h-1 w-8 rounded-full bg-primary/40 animate-pulse" />
            <div className="h-1 w-2 rounded-full bg-primary/20 animate-pulse delay-75" />
            <div className="h-1 w-1 rounded-full bg-primary/10 animate-pulse delay-150" />
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/20">Establishing secure encrypted data transmission...</p>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
}
