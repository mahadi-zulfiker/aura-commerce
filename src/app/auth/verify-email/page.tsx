"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldCheck, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

const verifySchema = z.object({
  token: z.string().length(6, "PIN must be 6 digits"),
});

type VerifyForm = z.infer<typeof verifySchema>;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
  });

  useEffect(() => {
    if (tokenParam) {
      setValue("token", tokenParam);
    }
  }, [tokenParam, setValue]);

  const onSubmit = async (data: VerifyForm) => {
    try {
      await apiPost("/auth/verify-email", data);
      toast.success("Email verified", {
        description: "You've successfully secured your Aura account.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Verification failed", {
        description: error.message || "Please check the token and try again.",
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center lg:text-left">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-primary/10 border border-primary/20 mb-4 animate-pulse">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight">
          Verify <span className="text-primary italic">Email.</span>
        </h1>
        <p className="text-white/50 text-base font-medium">
          {emailParam
            ? `We've sent a 6-digit PIN to ${emailParam}.`
            : "Enter the verification PIN sent to your email."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="token" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Verification PIN</Label>
          <div className="relative group/input">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within/input:text-primary transition-colors" />
            <Input
              id="token"
              placeholder="000 000"
              {...register("token")}
              maxLength={6}
              disabled={isSubmitting}
              className="h-14 bg-white/5 border-white/10 focus:border-primary/50 text-2xl font-display font-bold tracking-[0.5em] rounded-2xl pl-12 transition-all duration-300 placeholder:text-white/5"
            />
          </div>
          {errors.token && <p className="text-[10px] font-bold text-destructive ml-1">{errors.token.message}</p>}
        </div>

        <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Identity"}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
