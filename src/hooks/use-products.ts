import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Product, SortOption } from "@/types/store";

export interface ProductsQueryParams {
  category?: string;
  brand?: string;
  search?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export function useProducts(
  params: ProductsQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      apiGet<PaginatedResponse<Product>>("/products", {
        category: params.category,
        brand: params.brand,
        search: params.search,
        sort: params.sort,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        minRating: params.minRating,
        page: params.page,
        limit: params.limit,
      }),
    enabled: options?.enabled ?? true,
  });
}
