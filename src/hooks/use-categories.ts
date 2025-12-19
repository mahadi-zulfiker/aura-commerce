import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Category } from "@/types/store";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiGet<Category[]>("/categories"),
  });
}
