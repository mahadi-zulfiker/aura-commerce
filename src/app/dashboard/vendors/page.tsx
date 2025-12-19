"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShopAdmin {
  id: string;
  name: string;
  email: string;
  status: string;
  slug: string;
}

export default function VendorsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-shops", page, statusFilter],
    queryFn: () =>
      apiGet<PaginatedResponse<ShopAdmin>>("/shops/admin/all", {
        page,
        limit: 20,
        status: statusFilter || undefined,
      }),
  });

  const shops = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 1;
  const filteredShops = useMemo(() => {
    if (!search) {
      return shops;
    }
    return shops.filter(
      (shop) =>
        shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, shops]);

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
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by shop or email"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="h-10 rounded-lg border border-border bg-muted/40 px-3 text-sm"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading shops...</p>
          ) : filteredShops.length === 0 ? (
            <p className="text-sm text-muted-foreground">No shop applications found.</p>
          ) : (
            <div className="space-y-4">
              {filteredShops.map((shop) => (
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
