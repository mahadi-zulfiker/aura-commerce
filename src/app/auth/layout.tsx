import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-slate-950 text-white overflow-hidden">
            {/* Visual Side (Desktop) */}
            <div className="hidden lg:block relative h-full w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
                    alt="Aura Experience"
                    fill
                    className="object-cover brightness-50"
                    priority
                />

                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-aura-sky/20 mix-blend-overlay" />
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />

                <div className="absolute inset-0 flex flex-col justify-between p-16 z-10">
                    <Link href="/" className="inline-flex items-center gap-4 group">
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-2xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
                            <Image src="/logo.svg" alt="Aura" width={28} height={28} className="brightness-0 invert" />
                        </div>
                        <span className="text-3xl font-display font-black tracking-tighter uppercase text-white">
                            AURA<span className="text-primary italic">.</span>
                        </span>
                    </Link>

                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Join the Elite</span>
                        </div>
                        <h2 className="text-5xl font-display font-black mb-6 leading-tight tracking-tight">
                            Engineering the <span className="text-primary italic">Future</span> of Commerce.
                        </h2>
                        <p className="text-lg text-white/50 leading-relaxed">
                            Experience a high-performance shopping ecosystem designed for those who demand excellence.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-white/30">
                        <span>© 2025 Aura</span>
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        <span>Premium Engineering</span>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-16 relative bg-slate-950">
                {/* Mobile Header */}
                <div className="lg:hidden absolute top-8 left-8 right-8 flex justify-center">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <Image src="/logo.svg" alt="Aura" width={24} height={24} className="brightness-0 invert" />
                        <span className="text-xl font-display font-black tracking-tighter uppercase text-white">
                            AURA<span className="text-primary italic">.</span>
                        </span>
                    </Link>
                </div>

                <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </div>
        </div>
    );
}
