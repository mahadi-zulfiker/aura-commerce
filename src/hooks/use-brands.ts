import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Brand } from "@/types/store";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => apiGet<Brand[]>("/brands"),
  });
}
