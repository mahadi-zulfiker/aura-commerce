# Aura Commerce Brand Guidelines

## Brand Identity
- Name: Aura Commerce
- Niche: Premium electronics and everyday tech essentials
- Voice: Calm, confident, curated, practical

## Logo
- Primary mark: `public/logo.svg`
- Usage: Use the circular gradient mark with the wordmark "Aura Commerce"
- Clear space: At least half the mark diameter around the logo

## Typography
- Display: Sora (headlines, product names, hero text)
- Body: Manrope (paragraphs, UI labels, helper text)

## Color System
- Primary (Sea Teal): hsl(173 66% 36%)
- Accent (Sunlit Amber): hsl(32 90% 55%)
- Highlight (Sky): hsl(200 85% 52%)
- Ink (Text): hsl(215 28% 17%)
- Sand (Background): hsl(32 33% 97%)

## UI Usage Notes
- Use teal for primary actions and key navigation.
- Use amber for promotional pricing, badges, and limited-time offers.
- Use sky as a subtle gradient accent, never as a base background.
- Favor warm, light surfaces in light mode, with deep navy in dark mode.

## Imagery
- Use high-quality images from Unsplash or Pexels.
- Keep consistent aspect ratios (1:1 or 4:3) and neutral lighting.
- Prefer calm, minimal product scenes over busy backgrounds.

Plan
Using the plan skill because this is a broad, multi-system audit and remediation effort spanning backend, frontend, and UX.

Requirements
Audit and fix auth flow (login/logout/session, token refresh, protected routes, hydration races, persistence).
Backend endpoint review for validation, error handling, transactions, middleware (auth/CORS/rate limiting/logging).
E-commerce core logic review (products, cart, checkout, orders, payments, users, admin).
Frontend UX upgrades (skeleton loaders, smooth transitions, CLS control, mobile-first responsiveness).
Deliverables: prioritized analysis report, production-ready fixes, and an implementation guide.
Scope
In: aura-commerce-backend + aura-commerce-frontend, Prisma schema, API client, auth store/guards, checkout/payment flows, dashboard/admin.
Out: production infra setup for Stripe/SMTP/CDN/shipping providers unless specified.
Files and entry points
Backend: main.ts, app.module.ts, schema.prisma
Backend auth/middleware: auth.service.ts, auth.controller.ts, jwt-auth.guard.ts
Backend core modules: orders.controller.ts, payments.controller.ts, cart.controller.ts, products.controller.ts
Frontend auth/state: api.ts, auth.ts, layout.tsx, page.tsx
Frontend UX: skeleton.tsx, page.tsx, page.tsx
Data model / API changes
Possible: refresh-token persistence or session table, order status history, return/refund entities, shipping/tax tables, webhook idempotency keys.
Action items
[ ] Map current auth flow (backend + frontend) and document where hydration/persistence breaks on refresh.
[ ] Implement durable auth state bootstrapping (guarded hydration, refresh-on-load, protected route gating).
[ ] Audit backend endpoints for validation/errors/HTTP codes; standardize filters and logging.
[ ] Add rate limiting and tighten auth/roles middleware; verify CORS config.
[ ] Make order/payment flows transactional; add idempotent webhook handling and stock checks.
[ ] Audit feature completeness (wishlist, reviews, coupons, shipping/tax, returns) and close gaps.
[ ] Add skeleton loaders and route-level loading.tsx for data-heavy pages; ensure smooth transitions/CLS.
[ ] Mobile-first responsive pass on dashboard, products, cart/checkout, and navigation.
[ ] Produce analysis report + implementation guide (env vars, migrations, test commands, setup steps).

Testing and validation
Backend: npm run test, npm run lint, npm run start:dev, Swagger checks.
Frontend: npm run lint, npm run dev, responsive viewport checks, auth refresh on reload, checkout/payment flows.
Manual: token refresh, protected routes, order creation, webhook replay/idempotency.
Risks and edge cases
Auth refresh loops or clearing tokens prematurely during hydration.
Race conditions between local storage and API refresh.
Inventory oversell without atomic stock handling.
Duplicate Stripe webhooks without idempotency.
Skeleton loaders causing layout shifts on slow networks.
Open questions
Keep localStorage tokens or move to httpOnly cookies + CSRF protection?
Any preferred providers for shipping/tax calculation and email delivery?
Priority order: auth/backend hardening vs UX/mobile vs feature gaps?
How do you want to proceed?

Adjust the plan
Start implementation
Save this plan to ~/.codex/plans
Save this plan to ~/.codex/plans

Start implementation


Plan saved to ecommerce-platform-audit-enhancement.md (Python isn’t available for the helper script, so I wrote it directly). Started implementation by adding auth hydration gating and skeleton loaders to prevent refresh redirects and reduce CLS.

auth.ts: track hasHydrated and partialize persisted state so route guards can wait for hydration.
page.tsx: delay auth redirect until hydration and render a checkout skeleton while auth is initializing.
layout.tsx: swap the null render for a dashboard skeleton and use the store’s hydration flag for guarding.
page.tsx: replace the loading text with an orders list skeleton.
Tests not run.

Note: no AGENTS.md found under e:\PH - LEVEL 2\E-Commerce-app.

Next steps (pick one):

Continue auth hardening: refresh‑on‑load bootstrap + /auth/me hydration + shared protected‑route helper.
Add remaining skeleton loaders (product detail, cart, product listing, user dashboard) and mobile layout tweaks.
Begin backend audit: orders/payments/cart endpoints for validation, transactions, and webhook idempotency.
