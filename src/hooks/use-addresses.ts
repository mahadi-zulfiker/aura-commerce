import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Address } from "@/types/api";

export function useAddresses() {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => apiGet<Address[]>("/addresses"),
    enabled: hasHydrated && isAuthenticated,
  });
}
