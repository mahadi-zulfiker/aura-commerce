"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, User, Sparkles, Chrome, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        try {
            const res = await apiPost<{
                user: any;
                emailVerificationRequired?: boolean;
                emailSent?: boolean;
            }>("auth/register", data);

            login(res.user);
            if (res.emailVerificationRequired) {
                toast.success("Account created!", {
                    description: res.emailSent
                        ? "Check your inbox to verify your email."
                        : "Verification token generated. Please verify your email.",
                });
                router.push(`/auth/verify-email?email=${encodeURIComponent(res.user.email)}`);
            } else {
                toast.success("Account created!", {
                    description: "Welcome to Aura Commerce.",
                });
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error("Registration failed", {
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
                    Join the <span className="text-primary italic">Elite.</span>
                </h1>
                <p className="text-white/50 text-base font-medium">
                    Create your account to start your journey with Aura.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">First Name</Label>
                        <div className="relative group/input">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within/input:text-primary transition-colors" />
                            <Input
                                id="firstName"
                                placeholder="Alex"
                                {...register("firstName")}
                                disabled={isLoading}
                                className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-2xl pl-12 transition-all duration-300 placeholder:text-white/10"
                            />
                        </div>
                        {errors.firstName && (
                            <p className="text-[10px] font-bold text-destructive ml-1">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Last Name</Label>
                        <Input
                            id="lastName"
                            placeholder="Vance"
                            {...register("lastName")}
                            disabled={isLoading}
                            className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-2xl px-6 transition-all duration-300 placeholder:text-white/10"
                        />
                        {errors.lastName && (
                            <p className="text-[10px] font-bold text-destructive ml-1">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

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
                        <p className="text-[10px] font-bold text-destructive ml-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Password</Label>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within/input:text-primary transition-colors" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            disabled={isLoading}
                            className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-2xl pl-12 transition-all duration-300 placeholder:text-white/10"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-[10px] font-bold text-destructive ml-1">{errors.password.message}</p>
                    )}
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Aura Account"}
                    </Button>
                </div>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                        <span className="bg-slate-950 px-4 text-white/20 font-black">Or sign up with</span>
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

            <p className="text-center text-sm text-white/40">
                Already part of the elite?{" "}
                <Link href="/auth/login" className="text-primary font-bold hover:underline underline-offset-8 transition-all">
                    Sign In
                </Link>
            </p>
        </div>
    );
}
