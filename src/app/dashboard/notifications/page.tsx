"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, MailOpen } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function NotificationsPage() {
    const [page, setPage] = useState(1);
    const {
        notifications,
        totalPages,
        isLoading,
        markAsRead,
        markAllAsRead,
    } = useNotifications(page, 20);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">Manage your alerts and messages.</p>
                </div>
                <Button onClick={() => markAllAsRead.mutate()} variant="outline">
                    <MailOpen className="mr-2 h-4 w-4" />
                    Mark all as read
                </Button>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div>Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-muted/10">
                        <p className="text-muted-foreground">No notifications found.</p>
                    </div>
                ) : (
                    notifications.map((item) => (
                        <Card
                            key={item.id}
                            className={item.isRead ? "" : "border-primary/50 bg-primary/5"}
                        >
                            <CardContent className="flex items-start justify-between p-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">{item.title}</h4>
                                        {!item.isRead && <Badge>New</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.message}</p>
                                    <p className="text-xs text-muted-foreground pt-1">
                                        {format(new Date(item.createdAt), "PPP p")}
                                    </p>
                                </div>
                                {!item.isRead && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => markAsRead.mutate(item.id)}
                                        title="Mark as read"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                aria-disabled={page === 1}
                                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink isActive>{page}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                aria-disabled={page === totalPages}
                                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
