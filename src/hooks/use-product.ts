import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Product } from "@/types/store";

export function useProduct(slug?: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => apiGet<Product>(`/products/${slug}`),
    enabled: Boolean(slug),
  });
}
