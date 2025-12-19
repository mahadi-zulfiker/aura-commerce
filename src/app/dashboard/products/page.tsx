"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Product } from "@/types/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VendorProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-products"],
    queryFn: () => apiGet<PaginatedResponse<Product>>("/products/mine"),
  });

  const products = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">Manage your catalog and inventory.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Stock: {product.stockCount}</div>
                  <div className="font-medium">${product.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
