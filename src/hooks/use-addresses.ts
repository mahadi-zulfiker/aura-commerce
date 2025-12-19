import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Address } from "@/types/api";

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => apiGet<Address[]>("/addresses"),
  });
}
