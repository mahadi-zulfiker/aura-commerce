import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/store";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, openCart } = useCartStore();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`, {
      action: {
        label: "View Cart",
        onClick: () => openCart(),
      },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className={cn("group block", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted/30">
          <img
            src={product.images[isHovered && product.images[1] ? 1 : 0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && <Badge variant="new">NEW</Badge>}
            {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          </div>

          {/* Quick Actions */}
          <div
            className={cn(
              "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}
          >
            <Button
              variant="glass"
              size="icon"
              className="h-9 w-9"
              onClick={handleWishlist}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isWishlisted && "fill-destructive text-destructive"
                )}
              />
            </Button>
            <Button
              variant="glass"
              size="icon"
              className="h-9 w-9"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Overlay */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              variant="glow"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* Brand */}
          <span className="text-xs text-primary font-medium uppercase tracking-wider">
            {product.brand}
          </span>

          {/* Name */}
          <h3 className="font-medium mt-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto pt-3">
            <span className="text-lg font-display font-bold text-primary">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.inStock ? (
            product.stockCount < 10 && (
              <span className="text-xs text-accent mt-1">
                Only {product.stockCount} left!
              </span>
            )
          ) : (
            <span className="text-xs text-destructive mt-1">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
