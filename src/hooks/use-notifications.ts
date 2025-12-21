import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { PaginatedResponse } from "@/types/api";

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationResponse extends PaginatedResponse<Notification> {
    meta: PaginatedResponse<Notification>["meta"] & {
        unreadCount: number;
    };
}

export function useNotifications(page = 1, limit = 20) {
    const { isAuthenticated, hasHydrated } = useAuthStore();
    const queryClient = useQueryClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["notifications", page, limit],
        queryFn: () =>
            apiGet<NotificationResponse>("/notifications", {
                page,
                limit,
            }),
        enabled: hasHydrated && isAuthenticated,
        refetchInterval: 30000, // Poll every 30s
    });

    const markAsRead = useMutation({
        mutationFn: (id: string) => apiPatch(`/notifications/${id}/read`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    const markAllAsRead = useMutation({
        mutationFn: () => apiPatch("/notifications/read-all", {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });

    return {
        notifications: data?.data ?? [],
        unreadCount: data?.meta.unreadCount ?? 0,
        totalPages: data?.meta.totalPages ?? 0,
        isLoading,
        refetch,
        markAsRead,
        markAllAsRead,
    };
}
