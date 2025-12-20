import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Product } from "@/types/store";

export interface WishlistItem {
  id: string;
  product: Product;
}

export function useWishlist() {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => apiGet<WishlistItem[]>("/wishlist"),
    enabled: hasHydrated && isAuthenticated,
  });
}
