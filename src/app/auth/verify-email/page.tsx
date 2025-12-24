"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

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
        description: "You can now use all Aura Commerce features.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast.error("Verification failed", {
        description: error.message || "Please check the token and try again.",
      });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Verify your email</h1>
          <p className="text-muted-foreground">
            {emailParam
              ? `Enter the 6-digit PIN sent to ${emailParam}.`
              : "Enter the 6-digit PIN sent to your email."}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="token">Verification PIN</Label>
            <Input id="token" placeholder="Enter 6-digit PIN" {...register("token")} maxLength={6} />
            {errors.token && <p className="text-sm text-red-500">{errors.token.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Email
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
