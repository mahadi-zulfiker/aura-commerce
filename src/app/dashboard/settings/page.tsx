"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, apiGet, apiPatch } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import {
  User,
  Settings,
  Shield,
  Bell,
  CreditCard,
  Smartphone,
  Camera,
  Check,
  Loader2,
  Lock,
  Globe,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { updateUser, user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiGet<ProfileForm>("/users/me");
        reset({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
          avatar: data.avatar ?? "",
        });
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          toast.error("Session expired");
          router.replace("/auth/login");
          return;
        }
        toast.error("Unable to load profile");
      }
    };

    loadProfile();
  }, [reset, router]);

  const onSubmit = async (values: ProfileForm) => {
    setIsLoading(true);
    try {
      const updated = await apiPatch<ProfileForm>("/users/me", values);
      updateUser(updated);
      toast.success("Profile preferences synchronized");
    } catch (error: any) {
      toast.error("Synchronization failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">
            <Settings className="h-3 w-3" />
            System Preferences
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-white">
            Workspace <span className="text-primary italic">Settings.</span>
          </h1>
          <p className="text-white/40 font-medium mt-1">Configure your identity and operational parameters.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Tabs */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 p-2 rounded-[2.5rem] bg-white/[0.03] border border-white/5 h-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 h-12 rounded-2xl transition-all duration-300 flex-1 lg:flex-none",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 max-w-3xl">
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white text-3xl font-display font-black shadow-2xl shadow-primary/20 overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.firstName?.charAt(0) || "A"
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-display font-black text-white">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{user?.email}</p>
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">{user?.role} Account</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">First Identity Component</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input {...register("firstName")} className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                      </div>
                      {errors.firstName && <p className="text-[10px] font-black text-destructive ml-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Last Identity Component</Label>
                      <Input {...register("lastName")} className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-primary/50 transition-all" />
                      {errors.lastName && <p className="text-[10px] font-black text-destructive ml-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Communication Channel</Label>
                      <div className="relative group">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input {...register("phone")} className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Asset Visualization (URL)</Label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input {...register("avatar")} className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 text-sm font-bold focus:border-primary/50 transition-all" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.95] transition-all px-10">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Check className="mr-2 h-4 w-4" /> Sync Preferences</>}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="p-8 md:p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-destructive/10">
                    <Shield className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-white">Deactivation Zone</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Irreversible operational state</p>
                  </div>
                </div>
                <p className="text-sm text-white/40 mb-6">Deactivating this node will purge all associated telemetry and accessibility. Proceed with extreme caution.</p>
                <Button variant="outline" className="h-12 rounded-xl border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all">
                  Initialize Deactivation
                </Button>
              </div>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="flex flex-col items-center justify-center py-20 px-6 rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.01] animate-in fade-in duration-500 text-center">
              <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-6">
                <Lock className="h-10 w-10 text-white/10" />
              </div>
              <h3 className="text-xl font-display font-black text-white">Under Maintenance</h3>
              <p className="text-white/40 text-sm font-medium mt-2">This configuration module is currently being optimized for high-performance access.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
