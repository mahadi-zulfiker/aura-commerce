import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: {
    default: "Aura Commerce",
    template: "%s | Aura Commerce",
  },
  description: "Curated tech essentials with a calm, modern edge.",
  metadataBase: new URL("http://localhost:3000"),
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Aura Commerce",
    description: "Curated tech essentials with a calm, modern edge.",
    url: "http://localhost:3000",
    siteName: "Aura Commerce",
    images: [
      {
        url: "/logo.svg",
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
