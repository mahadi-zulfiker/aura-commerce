import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                            {/* Replace with your Logo component if available */}
                            <div className="h-8 w-8 bg-black rounded-full" />
                            <span className="text-xl font-bold tracking-tight">Aura</span>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative h-full w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
                    alt="Office Workspace"
                    fill
                    className="object-cover dark:brightness-[0.2] dark:grayscale"
                    priority
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-10 left-10 p-6 text-white max-w-lg">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "Design is not just what it looks like and feels like. Design is how it works."
                        </p>
                        <footer className="text-sm border-t border-white/40 pt-2 inline-block">Steve Jobs</footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
