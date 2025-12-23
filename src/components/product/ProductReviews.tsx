"use client";

import { useReviews } from "@/hooks/use-reviews";
import { Star, ThumbsUp, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
    productId: string;
    rating: number;
    reviewCount: number;
}

export function ProductReviews({ productId, rating, reviewCount }: ProductReviewsProps) {
    const { data: reviews = [], isLoading } = useReviews(productId);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                    <Skeleton className="h-40 w-full rounded-2xl" />
                    <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Rating Summary */}
                <div className="p-8 rounded-2xl bg-muted/30 border border-border/50 text-center">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                        Customer Rating
                    </h3>
                    <p className="text-6xl font-display font-bold mb-2">{rating.toFixed(1)}</p>
                    <div className="flex justify-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-5 w-5",
                                    i < Math.round(rating) ? "fill-accent text-accent" : "text-muted-foreground/30"
                                )}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {reviewCount} reviews</p>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display font-bold text-xl">Recent Reviews</h3>
                        <Button variant="outline" size="sm">Write a Review</Button>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="text-center py-12 border border-dashed rounded-2xl">
                            <p className="text-muted-foreground">No reviews yet for this product.</p>
                            <p className="text-sm text-muted-foreground/60 mt-1">Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="p-6 rounded-2xl bg-aura-surface/40 border border-border/40">
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={review.userAvatar} />
                                                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold">{review.userName}</p>
                                                <div className="flex gap-1 mt-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "h-3 w-3",
                                                                i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {review.title && <h4 className="font-bold mb-2">{review.title}</h4>}
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                        {review.content}
                                    </p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                                            <ThumbsUp className="h-3 w-3" />
                                            Helpful ({review.helpful})
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
