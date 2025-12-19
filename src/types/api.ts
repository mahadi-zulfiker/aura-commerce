export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  subtotal?: number;
  tax?: number;
  shippingCost?: number;
  discount?: number;
  couponCode?: string | null;
  paymentMethod?: string;
  address?: Address;
  shop?: {
    id: string;
    name: string;
    slug?: string;
  } | null;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  image?: string | null;
  quantity: number;
  price: number;
  total: number;
  variantInfo?: Record<string, unknown> | null;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  label?: string | null;
}
