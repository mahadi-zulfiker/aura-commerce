import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export type Review = {
    id: string;
    productId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    rating: number;
    title: string;
    content: string;
    createdAt: string;
    helpful: number;
};

export function useReviews(productId: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["reviews", productId],
        queryFn: () => apiGet<Review[]>(`/reviews/product/${productId}`),
        enabled: options?.enabled ?? Boolean(productId),
    });
}
