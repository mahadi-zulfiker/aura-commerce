export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  categorySlug?: string;
  brand: string;
  brandSlug?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  features: string[];
  specifications: Record<string, string>;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface Review {
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
}

export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number | null;
  inStock: boolean;
}
