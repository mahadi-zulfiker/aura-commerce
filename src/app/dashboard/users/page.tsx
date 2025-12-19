"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const [page] = useState(1);
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => apiGet<PaginatedResponse<AdminUser>>("/users", { page, limit: 20 }),
  });

  const users = data?.data ?? [];

  const updateStatus = async (id: string, status: string) => {
    await apiPatch(`/users/${id}/status`, { status });
    toast.success("User updated");
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage customer accounts and access.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Role: {user.role}</div>
                  <div className="flex gap-2">
                    {user.status === "ACTIVE" ? (
                      <Button variant="outline" size="sm" onClick={() => updateStatus(user.id, "SUSPENDED")}>
                        Suspend
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => updateStatus(user.id, "ACTIVE")}>
                        Activate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
