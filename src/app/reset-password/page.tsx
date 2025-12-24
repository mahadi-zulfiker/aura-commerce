"use client";

import { Suspense, useEffect } from "react";
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

const resetSchema = z.object({
  token: z.string().length(6, "PIN must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type ResetForm = z.infer<typeof resetSchema>;

// Move the main component logic here
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    if (tokenParam) {
      setValue("token", tokenParam);
    }
  }, [tokenParam, setValue]);

  const onSubmit = async (data: ResetForm) => {
    try {
      await apiPost("/auth/reset-password", data);
      toast.success("Password updated", {
        description: "You can now log in with your new password.",
      });
      router.push("/auth/login");
    } catch (error: any) {
      toast.error("Reset failed", {
        description: error.message || "Please check the token and try again.",
      });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Reset password</h1>
          <p className="text-muted-foreground">
            Enter the reset PIN and choose a new password.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="token">Reset PIN</Label>
            <Input id="token" placeholder="Enter 6-digit PIN" {...register("token")} maxLength={6} />
            {errors.token && <p className="text-sm text-red-500">{errors.token.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
