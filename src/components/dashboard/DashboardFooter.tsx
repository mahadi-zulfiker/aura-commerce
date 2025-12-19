"use client";

import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-sm text-muted-foreground sm:flex-row md:px-8">
        <span>(c) 2024 Aura Commerce. Dashboard suite.</span>
        <div className="flex items-center gap-4">
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Support
          </Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
