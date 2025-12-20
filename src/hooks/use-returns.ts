import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { PaginatedResponse, ReturnRequest } from "@/types/api";

export function useReturns(page = 1, limit = 10) {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  return useQuery({
    queryKey: ["returns", page, limit],
    queryFn: () =>
      apiGet<PaginatedResponse<ReturnRequest>>("/returns", {
        page,
        limit,
      }),
    enabled: hasHydrated && isAuthenticated,
  });
}
