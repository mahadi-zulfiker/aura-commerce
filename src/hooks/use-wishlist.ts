import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Product } from "@/types/store";

export interface WishlistItem {
  id: string;
  product: Product;
}

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => apiGet<WishlistItem[]>("/wishlist"),
  });
}
