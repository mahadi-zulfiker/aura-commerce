import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Sora, Manrope } from "next/font/google";
import Providers from "./providers";
import { AppShell } from "@/components/layout/AppShell";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Aura Commerce",
    template: "%s | Aura Commerce",
  },
  description: "Curated tech essentials with a calm, modern edge.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }, { url: "/favicon.ico" }],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Aura Commerce",
    description: "Curated tech essentials with a calm, modern edge.",
    url: siteUrl,
    siteName: "Aura Commerce",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Aura Commerce",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <AppShell>
              <main className="flex-1">{children}</main>
              <ScrollToTop />
            </AppShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}
