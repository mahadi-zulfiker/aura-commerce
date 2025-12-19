"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ShopAdmin {
  id: string;
  name: string;
  email: string;
  status: string;
  slug: string;
}

export default function VendorsPage() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-shops"],
    queryFn: () => apiGet<PaginatedResponse<ShopAdmin>>("/shops/admin/all"),
  });

  const shops = data?.data ?? [];

  const updateStatus = async (id: string, status: string) => {
    await apiPatch(`/shops/${id}/status`, { status });
    toast.success("Shop status updated");
    refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendor Applications</h1>
        <p className="text-muted-foreground">Review and manage shop applications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shops</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading shops...</p>
          ) : shops.length === 0 ? (
            <p className="text-sm text-muted-foreground">No shop applications found.</p>
          ) : (
            <div className="space-y-4">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">{shop.name}</p>
                    <p className="text-sm text-muted-foreground">{shop.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Status: {shop.status}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(shop.id, "APPROVED")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateStatus(shop.id, "SUSPENDED")}
                    >
                      Suspend
                    </Button>
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
