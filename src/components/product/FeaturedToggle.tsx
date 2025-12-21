"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { apiPatch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface FeaturedToggleProps {
    productId: string;
    isFeatured: boolean;
}

export function FeaturedToggle({ productId, isFeatured }: FeaturedToggleProps) {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const mutation = useMutation({
        mutationFn: () =>
            apiPatch(`/products/${productId}`, { isFeatured: !isFeatured }),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["products"] });
            const previousProducts = queryClient.getQueryData(["products"]);

            queryClient.setQueryData(["products"], (old: any) => {
                if (!old?.data) return old;
                return {
                    ...old,
                    data: old.data.map((p: any) =>
                        p.id === productId ? { ...p, isFeatured: !isFeatured } : p
                    ),
                };
            });

            return { previousProducts };
        },
        onError: (err, newTodo, context) => {
            queryClient.setQueryData(["products"], context?.previousProducts);
            toast({
                title: "Error",
                description: "Failed to update product status.",
                variant: "destructive",
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onSuccess: () => {
            toast({
                title: "Product updated",
                description: `Product is ${!isFeatured ? "now" : "no longer"} featured.`,
            });
        }
    });

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className={cn(
                "h-8 w-8 hover:bg-transparent",
                isFeatured ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-amber-500/50"
            )}
            title={isFeatured ? "Unfeature product" : "Feature product"}
        >
            <Star className={cn("h-4 w-4", isFeatured && "fill-current")} />
            <span className="sr-only">Toggle featured</span>
        </Button>
    );
}
