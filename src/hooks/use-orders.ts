import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Order, PaginatedResponse } from "@/types/api";

export function useOrders(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () =>
      apiGet<PaginatedResponse<Order>>("/orders", {
        page,
        limit,
      }),
  });
}
