"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotForm) => {
    try {
      await apiPost("/auth/forgot-password", data);
      toast.success("Check your email", {
        description: "We sent a reset token if the account exists.",
      });
      router.push("/reset-password");
    } catch (error: any) {
      toast.error("Request failed", {
        description: error.message || "Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center lg:text-left">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-primary/10 border border-primary/20 mb-4 animate-bounce-slow">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight">
          Forgot <span className="text-primary italic">Password?</span>
        </h1>
        <p className="text-white/50 text-base font-medium">
          No worries. Enter your email and we'll send you a recovery link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</Label>
          <div className="relative group/input">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within/input:text-primary transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              disabled={isSubmitting}
              className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-base rounded-2xl pl-12 transition-all duration-300 placeholder:text-white/10"
            />
          </div>
          {errors.email && (
            <p className="text-[10px] font-bold text-destructive ml-1">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Recovery Link"}
        </Button>
      </form>

      <div className="text-center lg:text-left">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-primary font-bold transition-all group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
