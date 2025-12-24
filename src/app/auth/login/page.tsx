"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, Eye, EyeOff, Chrome, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const res = await apiPost<{
                user: any;
            }>("auth/login", data);

            login(res.user);
            toast.success("Welcome back!", {
                description: "You have successfully logged in.",
            });
            router.push("/dashboard");
        } catch (error: any) {
            toast.error("Login failed", {
                description: error.message || "Something went wrong",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-4xl font-display font-black tracking-tight">
                    Welcome <span className="text-primary italic">Back.</span>
                </h1>
                <p className="text-white/50 text-base font-medium">
                    Enter your credentials to access your dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</Label>
                    <div className="relative group/input">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within/input:text-primary transition-colors" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            {...register("email")}
                            disabled={isLoading}
                            className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-2xl pl-12 transition-all duration-300 placeholder:text-white/10"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1 ml-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Password</Label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-bold text-primary hover:text-primary-glow transition-colors underline underline-offset-8"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within/input:text-primary transition-colors" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("password")}
                            disabled={isLoading}
                            className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-2xl pl-12 pr-12 transition-all duration-300 placeholder:text-white/10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs font-bold text-destructive animate-in fade-in slide-in-from-top-1 ml-1">{errors.password.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In to Aura"}
                </Button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                        <span className="bg-slate-950 px-4 text-white/20 font-black">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all" disabled={isLoading}>
                        <Chrome className="h-4 w-4 mr-2" /> Google
                    </Button>
                    <Button variant="outline" type="button" className="h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all" disabled={isLoading}>
                        <Github className="h-4 w-4 mr-2" /> Github
                    </Button>
                </div>
            </form>

            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 text-center">Quick Access Prototypes</p>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: "Admin", email: "admin@example.com", password: "Admin@123" },
                        { label: "Vendor", email: "vendor@example.com", password: "Vendor@123" },
                        { label: "User", email: "user@example.com", password: "User@123" },
                    ].map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                                setValue("email", item.email);
                                setValue("password", item.password);
                            }}
                            className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-tighter text-white/60 hover:bg-primary/20 hover:border-primary/30 hover:text-primary transition-all"
                            disabled={isLoading}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-center text-sm text-white/40">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-primary font-bold hover:underline underline-offset-8 transition-all">
                    Create Account
                </Link>
            </p>
        </div>
    );
}
