# Aura Commerce Frontend

A modern, responsive **Next.js 14** e-commerce frontend for Aura Commerce, featuring a premium shopping experience with multi-vendor support, advanced filtering, real-time cart management, and comprehensive admin/vendor dashboards.

## 🚀 Features

### Customer Features
- **Modern Homepage** with hero section, featured products, and categories
- **Advanced Product Browsing**
  - Product listing with filters (category, brand, price range, rating)
  - Search functionality
  - Product detail pages with image galleries
  - Product variants (size, color, etc.)
  - Related products
- **Shopping Experience**
  - Persistent shopping cart
  - Wishlist functionality
  - Product reviews and ratings
  - Product comparison
- **Checkout Process**
  - Multi-step checkout flow
  - Address management
  - Multiple payment methods (Stripe, Cash on Delivery)
  - Order confirmation
  - Coupon/discount code application
- **User Account**
  - Profile management
  - Order history and tracking
  - Address book
  - Wishlist management
  - Notification center
  - Return requests

### Vendor Features
- **Shop Management**
  - Create and manage shop profile
  - Shop settings (logo, banner, description)
  - Shop analytics
- **Product Management**
  - Add/edit/delete products
  - Product variants management
  - Inventory tracking
  - Bulk product operations
- **Order Management**
  - View and process orders
  - Update order status
  - Shipping management
  - Order analytics
- **Analytics Dashboard**
  - Sales charts and statistics
  - Top products
  - Revenue tracking
  - Customer insights

### Admin Features
- **Complete Dashboard**
  - Overview analytics
  - Sales charts (daily, weekly, monthly)
  - Top products and categories
  - Recent orders
- **User Management**
  - View all users
  - Manage user roles and status
  - User activity tracking
- **Vendor Management**
  - Approve/reject vendor applications
  - Manage vendor shops
  - Monitor vendor performance
- **Product Management**
  - View all products across vendors
  - Approve/reject products
  - Featured products management
- **Order Management**
  - View all orders
  - Order status management
  - Refund processing
- **Category & Brand Management**
  - Create/edit/delete categories
  - Category hierarchy management
  - Brand management
- **Coupon Management**
  - Create promotional coupons
  - Set usage limits and restrictions
  - Track coupon usage
- **Store Settings**
  - Shipping configuration
  - Tax settings
  - Return policies
  - Email templates

### UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Dark Mode** support
- **Skeleton Loaders** for better perceived performance
- **Smooth Animations** with Framer Motion
- **Toast Notifications** for user feedback
- **Image Optimization** with Next.js Image
- **SEO Optimized** with metadata and structured data

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Payment**: Stripe React SDK
- **Icons**: Lucide React
- **Carousel**: Embla Carousel

## 📋 Prerequisites

- Node.js 18+ or higher
- npm, yarn, or bun package manager
- Backend API running (see [backend README](../aura-commerce-backend/README.md))

## 🔧 Installation

1. **Navigate to the frontend directory**
   ```bash
   cd aura-commerce-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:4000
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME=Aura Commerce
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Production Build
```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                        # Next.js 14 App Router pages
│   ├── (auth)/                # Auth pages (login, register, verify)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── dashboard/             # Dashboard pages
│   │   ├── (admin)/          # Admin-only pages
│   │   │   ├── analytics/
│   │   │   ├── users/
│   │   │   ├── vendors/
│   │   │   ├── all-products/
│   │   │   ├── categories/
│   │   │   ├── brands/
│   │   │   ├── coupons/
│   │   │   └── store-settings/
│   │   ├── (vendor)/         # Vendor-only pages
│   │   │   ├── products/
│   │   │   ├── shop-settings/
│   │   │   └── analytics/
│   │   ├── (user)/           # User pages
│   │   │   ├── orders/
│   │   │   ├── addresses/
│   │   │   ├── wishlist/
│   │   │   ├── returns/
│   │   │   └── settings/
│   │   ├── notifications/
│   │   └── layout.tsx
│   ├── product/[slug]/        # Product detail page
│   ├── products/              # Product listing
│   ├── shops/                 # Shop listing and detail
│   ├── checkout/              # Checkout flow
│   ├── about/                 # Static pages
│   ├── contact/
│   ├── faq/
│   ├── blog/
│   └── layout.tsx             # Root layout
├── components/                # React components
│   ├── ui/                   # Shadcn UI components
│   ├── home/                 # Homepage components
│   ├── products/             # Product components
│   ├── cart/                 # Cart components
│   ├── checkout/             # Checkout components
│   ├── dashboard/            # Dashboard components
│   ├── auth/                 # Auth components
│   └── shared/               # Shared components
├── hooks/                     # Custom React hooks
│   ├── use-auth.ts
│   ├── use-cart.ts
│   ├── use-products.ts
│   └── ...
├── lib/                       # Utility libraries
│   ├── api.ts                # API client
│   ├── utils.ts              # Helper functions
│   └── validators.ts         # Zod schemas
├── store/                     # Zustand stores
│   ├── auth.ts               # Auth state
│   └── cart.ts               # Cart state
├── types/                     # TypeScript types
│   └── index.ts
└── data/                      # Static data
    └── constants.ts
```

## 🎨 Styling & Theming

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- **Custom color palette** (Sea Teal, Sunlit Amber, Sky)
- **Custom fonts** (Sora for headings, Manrope for body)
- **Extended animations**
- **Custom shadows and gradients**

See `tailwind.config.ts` and `BRAND.md` for brand guidelines.

### Dark Mode

Toggle dark mode using the theme switcher in the navigation. Theme preference is persisted in localStorage.

## 🔐 Authentication Flow

1. **Registration**
   - User fills registration form
   - Email verification with 6-digit PIN
   - Automatic login after verification

2. **Login**
   - Email/password authentication
   - JWT access token (15min expiry)
   - Refresh token (7 days expiry)
   - Automatic token refresh

3. **Protected Routes**
   - Dashboard routes require authentication
   - Role-based access (USER, VENDOR, ADMIN)
   - Automatic redirect to login if unauthenticated

4. **Password Reset**
   - Request reset via email
   - Receive reset token
   - Set new password

## 🛒 Shopping Flow

1. **Browse Products**
   - View products on homepage or products page
   - Filter by category, brand, price, rating
   - Search for specific products

2. **Product Details**
   - View product images, description, specifications
   - Select variants (size, color)
   - Add to cart or wishlist
   - Read reviews

3. **Cart Management**
   - View cart items
   - Update quantities
   - Remove items
   - Apply coupon codes

4. **Checkout**
   - Select/add delivery address
   - Choose payment method
   - Review order
   - Complete payment (Stripe or COD)
   - Order confirmation

5. **Order Tracking**
   - View order status in dashboard
   - Track shipment
   - Request returns if needed

## 📊 State Management

### Zustand Stores

- **Auth Store** (`store/auth.ts`)
  - User authentication state
  - Login/logout actions
  - Token management
  - Hydration handling

- **Cart Store** (`store/cart.ts`)
  - Cart items
  - Add/remove/update items
  - Cart totals
  - Persistent cart (localStorage)

### React Query

Used for server state management:
- Product fetching and caching
- Order management
- User data
- Automatic refetching
- Optimistic updates

## 🎯 Key Pages

### Public Pages
- `/` - Homepage
- `/products` - Product listing
- `/product/[slug]` - Product details
- `/shops` - Shop listing
- `/shops/[slug]` - Shop details
- `/about` - About page
- `/contact` - Contact page
- `/faq` - FAQ page
- `/blog` - Blog listing

### Auth Pages
- `/auth/login` - Login
- `/auth/register` - Registration
- `/auth/verify-email` - Email verification
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset

### User Dashboard
- `/dashboard` - Dashboard overview
- `/dashboard/orders` - Order history
- `/dashboard/addresses` - Address management
- `/dashboard/wishlist` - Wishlist
- `/dashboard/returns` - Return requests
- `/dashboard/settings` - Account settings
- `/dashboard/notifications` - Notifications

### Vendor Dashboard
- `/dashboard/products` - Product management
- `/dashboard/shop-settings` - Shop settings
- `/dashboard/analytics` - Sales analytics

### Admin Dashboard
- `/dashboard/analytics` - Admin analytics
- `/dashboard/users` - User management
- `/dashboard/vendors` - Vendor management
- `/dashboard/all-products` - All products
- `/dashboard/categories` - Category management
- `/dashboard/brands` - Brand management
- `/dashboard/coupons` - Coupon management
- `/dashboard/store-settings` - Store settings

## 🔌 API Integration

The frontend communicates with the backend via REST API. See `lib/api.ts` for the API client configuration.

### API Client Features
- Automatic token injection
- Token refresh on 401
- Request/response interceptors
- Error handling
- TypeScript types

### Example API Call
```typescript
import { api } from '@/lib/api';

// Fetch products
const products = await api.get('/products', {
  params: { category: 'electronics', page: 1 }
});

// Create order
const order = await api.post('/orders', orderData);
```

## 🎨 Component Library

Built with **Radix UI** primitives and styled with **Tailwind CSS**. Components are located in `components/ui/`:

- Buttons, Inputs, Selects
- Dialogs, Modals, Drawers
- Dropdowns, Menus
- Tabs, Accordions
- Toast notifications
- Data tables
- Cards, Badges
- Skeletons, Loaders

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Mobile-first approach ensures optimal experience on all devices.

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

4. **Configure production domain**

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Traditional Node.js hosting

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | No |

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🎨 Brand Guidelines

See [BRAND.md](./BRAND.md) for:
- Color palette
- Typography
- Logo usage
- UI patterns
- Imagery guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and unlicensed.

## 👥 Support

For support, email support@auracommerce.com or open an issue in the repository.

## 🔗 Related

- [Backend Repository](../aura-commerce-backend)
- [API Documentation](http://localhost:4000/docs)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)

---

**Built with ❤️ using Next.js 14 and TypeScript**
