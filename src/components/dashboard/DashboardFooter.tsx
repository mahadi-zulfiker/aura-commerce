"use client";

import Link from "next/link";
import { ShieldCheck, Cpu, Globe } from "lucide-react";

export function DashboardFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-slate-950/50 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 md:px-10 md:flex-row">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            <ShieldCheck className="h-3 w-3 text-primary" />
            Secured Infrastructure
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            &copy; {currentYear} Aura High-Dynamics. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors">
              Support Hub
            </Link>
            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors">
              Legal Framework
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/20">
            <Cpu className="h-3 w-3" />
            v2.4.0-STABLE
          </div>
        </div>
      </div>
    </footer>
  );
}
