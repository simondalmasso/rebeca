# ORDER-001 — REBECA-SF MASTER IMPLEMENTATION ORDER

**Issued:** 2026-09-16  
**Issuer:** AUD 🧠  
**Executor:** ARQ 🛠️  
**Status:** ACTIVE  
**Repository:** `simondalmasso/rebeca-sf`  
**Project ID:** `86549154`  
**Remote baseline reconstructed before issue:** `main@7ae965fa422c0141e4a06de9a91f2aabbe092029`  
**Remote state at issue:** 2 commits, 1 branch (`main`), 0 merge requests, 0 pipelines, 0 issues; repository contains only `README.md` and `docs/aud/GOVERNANCE.md`; no product code exists.  
**Extends and supersedes for implementation:** `AUD-001 — Constitución y Arquitectura V1` while preserving its governance principles.  

---

## 0. EXECUTION CONTRACT

ARQ is authorized by this order to implement the complete release candidate end-to-end. ARQ must not wait for AUD between internal tasks. AUD will audit after ARQ publishes the material final checkpoint.

Mandatory rules:

1. `VERIFY > ASSUME`.
2. Evidence before every completion claim.
3. Root cause over superficial patch.
4. End-to-end behavior over CI-green-only.
5. No fake success, no inert controls, no placeholder UI, no hidden required work.
6. No card/payment credential collection. This project closes orders through WhatsApp; it is not a payment gateway.
7. No secrets in Git. Secrets/configuration belong in Cloudflare/GitLab protected variables.
8. No unrelated frameworks, microservices, queues, containers, authentication SaaS, generic CMS, or architecture expansion without a demonstrated requirement.
9. Keep the implementation understandable by one engineer and operable by nontechnical store owners.
10. Use a feature branch from the exact reconstructed baseline, recommended name: `feat/order-001-rebeca-v1`.
11. Open a Draft MR against `main` when the first material checkpoint exists. Do not merge until AUD has audited the final checkpoint unless a later explicit order says otherwise.
12. A Cloudflare preview/release-candidate deployment is authorized after the deployment gates in this order pass. Production custom-domain cutover and `main` merge remain AUD-gated.
13. `BLOCKED_REAL` is valid only for an external dependency that ARQ cannot solve: unavailable account permission, unavailable Cloudflare/R2 activation, missing external credential owned by the user/business, or external service outage. A coding problem, design choice, test failure, missing fixture, or undocumented decision is not `BLOCKED_REAL`.

---

## 1. PRODUCT OBJECTIVE

Build a fast, highly visual, mobile-first fashion storefront proposal for **Rebeca Santa Fe** that behaves like a real ecommerce experience while intentionally finishing the transaction through WhatsApp.

The finished release candidate must let a shopper:

- land on an editorial home page;
- browse a real catalog experience by category;
- search/filter/sort without friction;
- open a product detail page with useful imagery, size/color variants and availability;
- add/remove/update variants in a persistent cart;
- survive reload/navigation without losing the cart;
- review the full order;
- enter only the minimum customer/context data necessary;
- generate a canonical order summary with a unique order code;
- open WhatsApp with a deterministic, URL-encoded message containing order code, customer name, delivery preference, line items, selected variants, quantities and total;
- never be asked for card data or be misled into thinking an online payment was processed.

The finished release candidate must also let a nontechnical owner:

- sign into a private `/admin` area;
- create, edit, duplicate, publish/unpublish and archive products;
- manage categories;
- manage price, optional compare-at price, sizes/colors, availability, SKU and featured state;
- upload/reorder/delete product images;
- edit core store settings including WhatsApp destination and demo/proposal mode;
- import/export the catalog as CSV and JSON;
- operate the catalog without Git, GitLab, code editing or redeployment;
- leave a stable integration seam for a future ERP without replacing the storefront or database model.

---

## 2. AUD DECISIONS — DO NOT REOPEN WITHOUT MATERIAL EVIDENCE

### 2.1 Hosting/runtime

Use **Cloudflare-first** architecture:

- Cloudflare Worker for API/runtime.
- Worker Static Assets for the storefront/admin compiled assets.
- Cloudflare D1 for structured catalog data.
- Cloudflare R2 Standard storage for uploaded product media.
- Cloudflare Access for `/admin*` and `/api/admin*` authentication/authorization.
- Cloudflare `workers.dev` release-candidate URL is acceptable for demo/proposal; custom domain is a later cutover.

Do **not** use Payload CMS as the V1 back office: its official Cloudflare D1 template currently states that Paid Workers are required because of bundle-size constraints.

Do **not** make Decap CMS the owner-facing back office: the GitLab backend requires users with push access to the repository, which is the wrong operating model for nontechnical store owners.

Do **not** adopt young generic CMS code wholesale as a mission-critical dependency. `cloudcore-cms/cloudcore-cms` is useful architectural reference material but currently identifies itself as v0.1.0 with light test coverage. `bihaviour/hedge-cms` explicitly describes itself as an early scaffold.

`ddyy/minshop` is a useful reference for Cloudflare Workers + D1 + R2 + merchant admin patterns and has materially more implementation history, but its payment rails, order stack, MCP and fulfillment features exceed this product’s V1 scope. Inspect patterns; do not fork the entire product.

### 2.2 Zero-cost target

The architecture is designed to remain at **USD 0 infrastructure cost for a small proposal/store within Cloudflare free allowances**. Current audited reference limits at order issue:

- Workers Free: 100,000 Worker requests/day; static asset requests are free/unlimited.
- D1 Free: 5,000,000 rows read/day, 100,000 rows written/day, 5 GB account storage; free-tier limits are enforced.
- R2 Standard Free: 10 GB-month storage, 1 million Class A ops/month, 10 million Class B ops/month, zero Internet egress fee.
- Cloudflare Access Free: up to 50 users; email OTP can be used for approved email addresses.

Do not add a paid dependency to solve a problem that these primitives solve. A domain registration, future ERP vendor, traffic beyond free allowances, or optional third-party service can create external cost later; those are outside the zero-cost infrastructure claim.

### 2.3 Frontend/backend stack

Use one TypeScript codebase:

- React 19 + Vite.
- React Router for routes.
- TypeScript strict mode.
- Hono for Worker API routing.
- D1 + Drizzle ORM for schema/migrations/querying.
- Zod shared schemas at all trust boundaries.
- Native CSS with project tokens/CSS modules or tightly scoped stylesheet architecture; do not import a heavyweight visual framework for the storefront.
- Lucide or Phosphor icons only where icons clarify controls.
- Vitest for unit/service tests.
- Playwright for browser E2E and screenshot evidence.
- Axe integration for automated accessibility checks.

The admin may use a small set of reusable internal primitives, but must not pull in a generic CMS shell.

### 2.4 Storefront data strategy

The storefront shell is static, but **catalog content is runtime data** from `/api/catalog`. Owners must be able to publish catalog changes without a frontend rebuild.

For the expected small catalog, load the published catalog once, then filter/sort client-side. Product deep links may fetch `/api/catalog/products/:slug`. Avoid search infrastructure, Vectorize, Algolia, Elasticsearch or Workers AI.

### 2.5 Owner authentication

Protect `/admin*` and `/api/admin*` with Cloudflare Access. Prefer allowlisted owner email addresses with One-Time PIN unless business owners later have an existing identity provider. The Worker must still validate trusted Access identity for mutating API routes instead of trusting a browser-supplied actor field.

No custom password database in V1.

### 2.6 ERP-ready “exoskeleton”

Do **not** integrate a specific ERP before one is named. Instead, build a real normalized ingestion boundary now.

All catalog writes — manual form, CSV import, JSON import, and future ERP — must converge on the same canonical `CatalogService` and canonical DTOs. Implement working manual/CSV/JSON adapters now. Document the provider adapter contract so a future ERP adapter only maps vendor data into the canonical DTO and invokes the existing upsert path.

This is not a placeholder: CSV/JSON import/export must be fully usable in V1 and serves as an immediate interchange bridge.

---

## 3. RESEARCH BASIS / DESIGN REFERENCES

Research sources used to make this order, for ARQ context only:

- Baymard Mobile Ecommerce UX: https://baymard.com/research/mcommerce-usability
- Baymard Mobile UX Trends 2026: https://baymard.com/blog/mobile-ux-ecommerce
- Baymard Product Page UX 2026: https://baymard.com/research-articles/current-state-ecommerce-product-page-ux
- Rebeca Instagram source: https://www.instagram.com/rebeca_santafee/
- Vestigia: https://www.vestigia.store/
- 47 Street: https://www.47street.com.ar/
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Static Assets billing: https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- Cloudflare D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/
- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare Access for Workers: https://developers.cloudflare.com/workers/configuration/cloudflare-access/
- Cloudflare OTP: https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/
- Cloudflare templates: https://github.com/cloudflare/templates
- Reference only: https://github.com/ddyy/minshop
- Reference only: https://github.com/yusufarbc/e-commerce-cloudflare
- Rejected as primary foundation, reference only: https://github.com/cloudcore-cms/cloudcore-cms
- Rejected for zero-cost V1: https://github.com/payloadcms/payload/tree/main/templates/with-cloudflare-d1

Observed reference direction:

- Vestigia supplies local Argentine fashion-store commercial logic and strong imagery-led merchandising; its static extraction currently appears dark/high-contrast, but inferred colors are not treated as an official palette.
- 47 Street uses a clean light base, DM Sans and high-energy accent colors; do not clone it.
- Baymard research reinforces highly visible category paths, strong mobile product imagery, discoverable product information, cart persistence, minimal checkout friction, and robust mobile interaction targets.

The target is a **Rebeca proposal**, not a clone of either reference.

---

## 4. INFORMATION ARCHITECTURE

Required public routes:

- `/` — editorial home.
- `/tienda` — all published products.
- `/categoria/:slug` — category listing.
- `/producto/:slug` — PDP.
- `/carrito` — cart.
- `/checkout` — order review + WhatsApp finalization.
- `/404`/route fallback — useful not-found state with route back to catalog.

Required private routes:

- `/admin` — dashboard/catalog overview.
- `/admin/productos` — product list/search/filter.
- `/admin/productos/nuevo` — create.
- `/admin/productos/:id` — edit.
- `/admin/categorias` — category management.
- `/admin/importar` — CSV/JSON import + dry-run preview + commit import.
- `/admin/exportar` — CSV/JSON download.
- `/admin/configuracion` — WhatsApp number, Instagram URL, store copy/settings, demo mode.

Do not build customer accounts, wishlists, online payments, reviews, coupons, loyalty, shipping carrier APIs, notifications, analytics dashboards, or ERP-specific screens in this order.

---

## 5. VISUAL SYSTEM — PROPOSAL DIRECTION

The storefront must feel editorial, fast, polished and tactile rather than like a generic Tiendanube template.

### 5.1 Core palette

Use the following proposal tokens unless real Rebeca brand assets provide stronger evidence:

```css
--bg: #FFFFFF;
--text: #111111;
--muted: #6B6B6B;
--surface: #F7F6F3;
--border: #E8E8E8;
--accent: #7A315D;
--accent-soft: #F1DDE7;
--danger: #B42318;
```

This is a proposal palette, not a claim about Rebeca’s official brand colors.

### 5.2 Typography

Use **DM Sans** for UI and display hierarchy to keep the system fast and contemporary. Self-host through the package/build when practical or load with a robust system fallback. Do not use Apple SF Pro files or redistribute proprietary fonts.

Required scale intent:

- hero display: fluid `clamp()` roughly 42–76 px desktop range and 38–52 px mobile range depending on composition;
- H1 PDP: 28–40 px;
- H2 section: 26–38 px;
- body: 16–18 px;
- UI controls: 14–16 px, never browser-default accidental typography.

### 5.3 Layout

- Mobile-first at 320 px and up.
- Mobile horizontal gutter: 16 px; tablet 24 px; desktop 32–48 px.
- Desktop content max width: approximately 1440 px where appropriate; full-bleed imagery may exceed it.
- Product media aspect ratio: 4:5.
- Keep cards visually open; do not wrap every unit in rounded panels.
- Product grids: 2 columns mobile, 3 tablet, 4 desktop where space permits.
- Touch targets >= 44x44 CSS px.
- Sticky mobile PDP purchase control is allowed after variant selection area is understood; it must not obscure content.
- Cart may use a drawer for quick feedback but `/carrito` remains a complete route.

### 5.4 Motion

Use restrained transforms/opacity with ~180–260 ms durations and an ease similar to `cubic-bezier(.22,1,.36,1)`. Respect `prefers-reduced-motion`. No scroll-jacking, excessive parallax, particle effects, cursor gimmicks or animation that blocks interaction.

### 5.5 Home composition

Required rhythm:

1. slim announcement band: `Comprá online · Coordiná entrega por WhatsApp`;
2. minimal header: text wordmark `REBECA`, primary category/shop navigation, search, cart count;
3. image-led first viewport with concise `Nueva colección` / `Ver tienda` offer;
4. `Lo nuevo` product rail/grid;
5. category editorial mosaic built from available catalog imagery;
6. `Elegidos de Rebeca` or equivalent featured selection;
7. Instagram callout linking to the real account;
8. compact footer with contact/social and proposal/demo state where applicable.

Do not invent testimonials, fake ratings, fake press logos, fake sales statistics or fake scarcity.

---

## 6. CATALOG SOURCE / IMAGERY POLICY

Primary source: public imagery from `@rebeca_santafee` where accessible for the proposal.

ARQ must not claim inferred/demo garments are actual Rebeca inventory.

Create `data/catalog-source-manifest.json` containing for every seeded product/media item:

- internal product slug;
- `source_kind`: `instagram_public` or `demo_generated`;
- source post URL when available;
- capture/import timestamp;
- local/R2 media key;
- image SHA-256;
- whether product name/price/variants are observed or inferred.

If Instagram does not expose enough usable public media without authenticated scraping, do not block the project. Build a coherent **12–18 item demo catalog** using plausible women’s fashion that Rebeca could reasonably sell, across a restrained category set such as tops/remeras, jeans/pantalones, camisas, sweaters/buzos and vestidos/faldas. Synthetic/demo images must not copy another brand’s logo or product identity.

Suggested neutral demo naming style: `Top Alba`, `Remera Nube`, `Jean Roma`, `Pantalón Marea`, `Camisa Lino`, `Sweater Bruma`, `Vestido Lila`, `Falda Siena`. These are examples of naming tone, not a requirement to use every name.

Demo catalog records must store `source_kind=demo_generated` and `demo_data=true` internally. Proposal deployments with any demo item must show a discreet but clear non-storefront-degrading notice such as `Propuesta demo · catálogo ilustrativo` so the site cannot be mistaken for confirmed inventory. The notice disappears only when an owner/admin disables demo mode after real data is loaded.

Do not infer a real Rebeca WhatsApp number, price, address or inventory claim from unrelated search results.

---

## 7. DATA MODEL

Use D1 migrations. Prices are integer centavos; never floating-point currency.

Minimum tables:

### `categories`

- `id` text primary key (ULID/UUID generated in application);
- `slug` text unique not null;
- `name` text not null;
- `description` text nullable;
- `sort_order` integer not null default 0;
- `active` integer/boolean not null default true;
- timestamps.

### `products`

- `id` text primary key;
- `slug` text unique not null;
- `title` text not null;
- `subtitle` text nullable;
- `description` text not null default empty;
- `category_id` FK nullable;
- `price_cents` integer not null check >= 0;
- `compare_at_price_cents` integer nullable check >= price when non-null;
- `currency` text not null default `ARS`;
- `status` constrained to `draft|published|archived`;
- `featured` boolean not null default false;
- `sort_order` integer not null default 0;
- `source_kind` constrained to `manual|instagram_public|demo_generated|csv|json|erp`;
- `external_source` nullable;
- `external_id` nullable;
- `demo_data` boolean not null default false;
- timestamps + `published_at` nullable;
- unique index on `(external_source, external_id)` when external id exists if D1/SQLite migration pattern supports the required partial/compound constraint safely.

### `product_variants`

- `id` text primary key;
- `product_id` FK cascade delete;
- `sku` text unique nullable;
- `size` text nullable;
- `color` text nullable;
- `price_override_cents` integer nullable;
- `availability` constrained to `available|out_of_stock|preorder`;
- `stock_qty` integer nullable; null means stock is not numerically tracked;
- `active` boolean;
- `sort_order` integer;
- timestamps.

### `product_media`

- `id` text primary key;
- `product_id` FK cascade delete;
- `r2_key_original` text not null;
- `r2_key_small` text nullable;
- `r2_key_large` text nullable;
- `alt_text` text not null;
- `source_url` text nullable;
- `source_kind` constrained to `instagram_public|upload|demo_generated`;
- `sha256` text not null;
- `width` integer nullable;
- `height` integer nullable;
- `content_type` text not null;
- `sort_order` integer;
- timestamps.

### `store_settings`

Typed singleton or typed key/value model with at least:

- brand/store name `REBECA`;
- Instagram URL;
- WhatsApp E.164 destination, nullable until owner supplies it;
- currency `ARS`;
- delivery/pickup label strings;
- `demo_mode` boolean;
- catalog revision integer;
- timestamps.

### `import_runs`

- `id`;
- `source_kind` (`csv|json|erp`);
- `source_name`;
- status `previewed|applied|failed`;
- checksum/idempotency key;
- counts created/updated/skipped/errors;
- error summary JSON/text;
- timestamps.

### `audit_events`

- `id`;
- actor email/identity from trusted Access context;
- action;
- entity type/id;
- before/after JSON snapshots with sensitive information excluded;
- timestamp.

No customer PII/order database is required in this V1. The checkout is client-side and hands off to WhatsApp. This intentionally limits privacy burden and scope.

---

## 8. CANONICAL CATALOG CONTRACT / FUTURE ERP SEAM

Create shared canonical types and Zod schemas, conceptually equivalent to:

```ts
type CatalogSource = 'manual' | 'instagram_public' | 'demo_generated' | 'csv' | 'json' | 'erp';

type CanonicalVariantInput = {
  externalId?: string;
  sku?: string;
  size?: string;
  color?: string;
  priceOverrideCents?: number;
  availability: 'available' | 'out_of_stock' | 'preorder';
  stockQty?: number | null;
  active: boolean;
};

type CanonicalProductInput = {
  externalId?: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  categorySlug?: string;
  priceCents: number;
  compareAtPriceCents?: number;
  currency: 'ARS';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  variants: CanonicalVariantInput[];
  source: CatalogSource;
  sourceName?: string;
  demoData: boolean;
};

interface CatalogSourceAdapter<T> {
  parse(input: T): Promise<CanonicalProductInput[]>;
}
```

Required adapters in this order:

- manual admin form -> canonical input;
- CSV -> canonical input;
- JSON -> canonical input.

Required service behavior:

- `CatalogService.upsertProduct()` owns validation and persistence;
- imports support dry-run preview before apply;
- repeated import with same stable external key/checksum is idempotent;
- import error rows do not silently corrupt valid products;
- export produces the same normalized field semantics required for re-import;
- future ERP implementation only adds an adapter/sync transport, not a new database schema or alternate product service.

Write `docs/architecture/erp-integration-contract.md` explaining pull, push/webhook and scheduled-sync options and exactly how a provider maps to this contract. No provider-specific code is required now.

---

## 9. API CONTRACT

Public API examples:

- `GET /api/catalog` — categories + published products + variants/media needed for browse.
- `GET /api/catalog/products/:slug` — one published product or 404.
- `GET /api/store-settings/public` — safe public settings only.
- `GET /api/health` — build SHA/version, environment, DB reachability without secrets.

Private API under Access:

- CRUD products;
- CRUD categories;
- media upload/delete/reorder;
- store settings get/update;
- import preview/apply;
- export CSV/JSON;
- audit list optional only if already trivial from schema; do not build a full audit dashboard.

All private mutating endpoints:

- require trusted Access identity;
- validate `Origin`/host against configured admin origin;
- accept explicit JSON/multipart content types only;
- validate payloads with Zod;
- return structured error objects with stable codes;
- never expose stack traces/secrets in production responses.

Public API returns only published/active content. Draft/archive/demo metadata not needed by shoppers must not leak except proposal/demo notice state.

---

## 10. MEDIA PIPELINE

R2 is the media source of truth for owner-uploaded product assets.

Because Workers Free CPU is constrained, do not perform expensive image encoding in the Worker. In the admin browser:

1. validate input type `image/jpeg|image/png|image/webp|image/avif` and max raw size 10 MB;
2. decode with browser APIs;
3. preserve original;
4. generate WebP derivatives client-side when source dimensions permit: approximately 720 px and 1440 px widths, no upscaling, quality tuned around 0.82–0.88;
5. compute/record SHA-256;
6. upload by streaming to the Worker/R2 endpoint;
7. persist dimensions, keys, type, alt text and ordering in D1.

Reject SVG uploads for catalog photos. Do not allow executable uploads.

Storefront image behavior:

- responsive `srcset/sizes` using derivative URLs;
- first meaningful hero/PDP image may use `fetchpriority=high`;
- below-fold media lazy-loads;
- stable dimensions/aspect-ratio prevent CLS;
- descriptive alt text for informative product images; empty alt only for truly duplicated decorative imagery.

If R2 cannot be activated because the Cloudflare account requires an owner-only checkout/payment-profile action, record exact dashboard/API evidence as `BLOCKED_REAL_R2_SUBSCRIPTION`. Do not silently replace R2 with a paid SaaS.

---

## 11. STOREFRONT BEHAVIOR

### Catalog/listing

- visible all-products/category path;
- compact search over title/category/color/SKU where appropriate;
- essential filters only: category, size, availability; add color only if data quality supports it;
- sort: featured/default, price low-high, price high-low, newest if timestamps are meaningful;
- mobile filters use a usable sheet/drawer with applied-filter state and reset;
- product cards show image, title, price, compare-at only when valid, compact variant/availability hint where useful;
- no hover-only essential information.

### PDP

- large swipeable/tappable gallery with obvious additional-image affordance;
- title, price, compare-at if valid, short description;
- size/color selector based on actual active variant combinations;
- unavailable combinations disabled, not merely rejected after click;
- explicit availability state;
- quantity stepper with sane min/max;
- Add to Cart cannot proceed until required variant attributes are selected;
- after add, provide visible success feedback and cart access;
- recently viewed/cross-sells are not required.

### Cart

- persistent local storage with schema versioning;
- line uniqueness based on product + selected variant;
- quantity update/remove;
- thumbnail, variant labels, unit price, line total;
- subtotal and total in ARS formatting;
- clear empty state and return-to-shop action;
- reload preserves state;
- invalid/outdated catalog items are reconciled gracefully on next catalog load rather than crashing.

### Checkout/WhatsApp

Collect only:

- customer name (required);
- delivery preference (`Coordinar envío` / `Retiro`, configurable labels);
- optional note.

No card fields and no payment-success language.

Generate order code client-side using date + cryptographically random suffix, e.g. `RB-20260916-X7K4Q`; uniqueness must not rely on `Math.random()`.

Canonical WhatsApp message format must be stable and testable, similar to:

```text
Hola Rebeca, quiero hacer este pedido.
Pedido: RB-20260916-X7K4Q
Nombre: <nombre>
Entrega: <preferencia>

1. <Producto> — <Talle> / <Color> × <cantidad> — $<subtotal línea>
2. ...

Total: $<total>
Nota: <nota si existe>
```

Construct destination with `https://wa.me/<E164-without-plus>?text=<encodeURIComponent(message)>`.

`store_settings.whatsapp_number` is owner-editable. Do not invent a production number. Admin must reject malformed values and non-demo publishing must surface a clear configuration error if no valid number exists. Automated E2E may inject a test fixture number and intercept/assert the outbound URL without messaging a real person.

---

## 12. ADMIN / “WORDPRESS-LIKE” CATALOG BUILDER

The private admin is intentionally boring, obvious and efficient.

### Product list

- search;
- status/category filter;
- thumbnail, name, price, status, featured, updated time;
- actions: edit, duplicate, publish/unpublish, archive;
- one clear `Nuevo producto` action.

### Product editor

Single-page editor with understandable grouped sections:

1. Basic information: title, slug auto-suggest with manual edit, category, subtitle, description.
2. Price: ARS price and optional compare-at price.
3. Variants: row builder for size/color/SKU/availability/optional numeric stock; duplicate row and remove row.
4. Images: drag/drop or picker, preview, alt text, reorder, remove.
5. Merchandising: featured, sort order.
6. Publication: draft/published/archive state.
7. Source metadata shown read-only where relevant.

Validation must be inline and human-readable. Unsaved changes must be signposted before navigation.

### Categories

Create/edit/reorder/activate categories. Prevent duplicate slugs. Products in a deactivated category remain valid but should not expose the inactive category in public navigation.

### Import

- upload CSV or JSON;
- parse in browser/worker as appropriate;
- show dry-run table: create/update/skip/error counts plus row-level errors;
- only apply after explicit confirmation;
- store import run/checksum;
- repeated apply of same file must not duplicate products.

### Export

Download current catalog in CSV and JSON using the canonical contract so the file can be used as backup/interchange.

### Settings

At minimum:

- store name;
- Instagram URL;
- WhatsApp E.164 number;
- delivery labels;
- demo mode.

No generic page builder is required.

---

## 13. SECURITY / PRIVACY

Required:

- Cloudflare Access isolation for admin surfaces;
- no public mutation endpoints;
- CSP appropriate to actual assets/analytics only;
- `X-Content-Type-Options: nosniff`;
- strict referrer policy;
- frame protection via CSP `frame-ancestors`;
- HSTS on production HTTPS domain where applicable;
- no secrets rendered to frontend bundles;
- dependency audit with no known high/critical production vulnerability left unexplained;
- secret scan in CI;
- media type/signature validation sufficient to reject obvious non-image payloads;
- no customer personal data persisted by the app in V1;
- analytics, if added at all, must be privacy-minimal and cannot block release. Do not add tracking merely because a plugin exists.

---

## 14. REPOSITORY / FILE BOUNDARIES

Keep one package unless evidence demands otherwise. Recommended responsibility map:

```text
src/
  app/                    # routing + composition only
  components/             # shared presentational primitives
  features/home/
  features/catalog/
  features/product/
  features/cart/
  features/checkout/
  features/admin/
  lib/                    # formatting, storage, HTTP client, utilities
  styles/                 # tokens/base/layout/motion
worker/
  index.ts
  routes/public/
  routes/admin/
  services/catalog-service.ts
  services/import-service.ts
  services/media-service.ts
  adapters/manual-adapter.ts
  adapters/csv-adapter.ts
  adapters/json-adapter.ts
  db/schema.ts
  db/migrations/
shared/
  catalog-contract.ts
  schemas.ts
  money.ts
  whatsapp-order.ts
data/
  catalog-source-manifest.json
  demo-catalog.json
scripts/
  seed-demo.ts
  verify-catalog.ts
tests/
  unit/
  integration/
  e2e/
docs/
  architecture/erp-integration-contract.md
  evidence/ORDER-001/
```

Do not create giant monolithic `App.tsx`, admin component or Worker router. Split by responsibility.

---

## 15. IMPLEMENTATION SEQUENCE

ARQ may parallelize independent work but must preserve the dependency order.

### Phase A — Foundation

1. Create feature branch from exact baseline.
2. Scaffold React/Vite/TypeScript + Hono Worker static-assets deployment.
3. Configure strict TS, lint/format, Vitest, Playwright.
4. Establish tokens/base CSS and route shell.
5. Add health endpoint containing git/build SHA and environment label.
6. Add D1/R2 bindings and local dev configuration without committing real IDs/secrets where secrets are inappropriate.

Checkpoint evidence: local app boots, health returns 200, tests/build commands exist and run.

### Phase B — Data core / exoskeleton

1. Implement D1 schema + migrations.
2. Implement shared Zod canonical contract.
3. Implement catalog service.
4. Implement manual/CSV/JSON adapters and idempotent import run logic.
5. Implement public catalog API.
6. Implement admin CRUD APIs under local test auth boundary, then Access production boundary.
7. Implement export.
8. Write ERP integration contract doc.

Checkpoint evidence: integration tests show manual create -> public publish, CSV dry-run/apply, repeat import no duplication, export/re-import semantic round-trip.

### Phase C — Media

1. R2 media routes/service.
2. Client-side derivative generation.
3. admin media UI.
4. responsive storefront image component.
5. seed/import source manifest.

Checkpoint evidence: image upload -> R2 -> DB -> public storefront render; delete/reorder reflected; invalid file rejected.

### Phase D — Storefront UX

Implement home, catalog, category, PDP, cart, checkout in that order. Use the visual system in this order. All controls must be real.

Checkpoint evidence: browser walkthrough from home to WhatsApp URL generation on mobile and desktop.

### Phase E — Admin UX

Implement products, categories, import/export, settings. Protect with Access in release environment.

Checkpoint evidence: admin creates a product including media/variant, publishes it, public storefront displays it without frontend rebuild, admin edits it and public view updates.

### Phase F — Demo catalog / visual polish

1. Attempt reasonable public Rebeca Instagram asset sourcing.
2. Complete 12–18 coherent SKUs with demo-generated product imagery if real assets are insufficient.
3. Maintain provenance manifest.
4. Ensure demo notice is on if any inferred catalog is used.
5. Polish visual hierarchy and responsive behavior.

### Phase G — CI / deploy / verification

1. GitLab CI.
2. Cloudflare release-candidate deployment.
3. run production-URL smoke/E2E subset.
4. capture evidence.
5. open/update Draft MR with exact evidence links/results.

---

## 16. REQUIRED TEST MATRIX

### Unit

At minimum test:

- ARS money formatting and integer arithmetic;
- slug normalization/collision strategy;
- variant selection compatibility;
- cart add/update/remove/reconciliation;
- localStorage schema migration/reset behavior;
- order code format and crypto path;
- WhatsApp message exact canonical formatting and URL encoding;
- Zod catalog schemas;
- CSV parser edge cases including quoted commas/newlines;
- import mapping and idempotency key calculation.

### Integration/API

At minimum:

- migrations apply cleanly to empty local D1;
- product create/update/publish/archive;
- draft product never appears on public catalog;
- category activation behavior;
- media metadata lifecycle;
- admin endpoint rejects unauthenticated/untrusted actor in production-mode tests;
- invalid origin rejected for mutations;
- CSV dry-run has zero mutation;
- apply creates/updates as preview predicted;
- same import twice does not duplicate;
- export JSON validates against canonical schema;
- malformed payload returns stable 4xx, not 500.

### Browser E2E public

Required path:

`home -> tienda -> product -> choose required variant -> add -> cart -> reload -> cart preserved -> checkout -> enter name/delivery -> click final CTA -> assert exact WhatsApp URL/message`

Also:

- empty cart;
- unavailable variant;
- quantity update/remove;
- direct product deep link;
- 404;
- filters reset and mobile filter sheet;
- no horizontal overflow at 320 px.

### Browser E2E admin/local test environment

Required path:

`admin product create -> upload fixture image -> add variants -> publish -> public product visible -> edit price/title -> public product updated -> export -> import dry-run`

Do not weaken real production Access to make E2E convenient. Use an explicit test-only identity injection path impossible in production build/config.

---

## 17. VISUAL / RESPONSIVE / ACCESSIBILITY GATES

Capture screenshots at minimum:

- 320x720;
- 360x800;
- 390x844;
- 768x1024;
- 1440x900.

Required surfaces:

- home first viewport + downstream section;
- catalog with filters;
- PDP with selected variant;
- cart;
- checkout;
- admin product editor.

Objective requirements:

- no clipped primary content;
- no horizontal page overflow;
- no unreadable text or overlapping fixed controls;
- visible keyboard focus;
- labels for every form control;
- semantic buttons/links;
- reduced motion honored;
- automated axe scan reports zero critical/serious issues on core public routes and admin editor under test auth;
- color contrast meets WCAG AA for normal UI text and controls.

---

## 18. PERFORMANCE GATES

Storefront release-candidate targets on representative mobile Lighthouse runs (median of 3 when environment is stable):

- Performance >= 90;
- Accessibility >= 95;
- Best Practices >= 95;
- SEO >= 90;
- LCP target <= 2.5 s under Lighthouse mobile profile where network/environment allows meaningful measurement;
- CLS <= 0.1;
- no unbounded eager image loading;
- storefront initial JS target <= ~180 KB gzip excluding lazily loaded admin chunks. If exceeded, ARQ must identify the dependency/route causing it and justify or reduce it.

Admin may be code-split and must not inflate public initial bundle materially.

Do not game Lighthouse by removing required functionality.

---

## 19. CI CONTRACT

Add `.gitlab-ci.yml` with reproducible jobs/stages covering:

1. install (`npm ci`);
2. typecheck;
3. lint/format check;
4. unit tests;
5. integration tests with local D1/migrations;
6. production build;
7. secret scan;
8. production dependency audit threshold for high/critical findings;
9. Playwright E2E against local Worker/app;
10. release-candidate deploy only from the authorized feature/release path after all prior gates pass, using protected GitLab variables;
11. post-deploy smoke against the actual URL.

Upload Playwright screenshots/traces/reports on failure and retain useful release evidence on success.

A green pipeline is necessary but not sufficient for DONE.

---

## 20. RELEASE-CANDIDATE DEPLOYMENT

Primary deploy: Cloudflare.

Use automated Wrangler/GitLab CI deploy, not an improvised manual production upload. Provision/bind:

- one D1 database;
- one R2 Standard bucket;
- Worker static assets + API;
- Access policy for admin paths.

If `rebeca-sf.web.app` already exists and can be mirrored with no new operational complexity, ARQ may add a static storefront mirror, but **Firebase is not part of DONE**. Cloudflare is the canonical deployment. Do not duplicate dynamic admin/catalog infrastructure into Firebase.

The release-candidate URL must expose `/api/health` and identify the exact git SHA deployed.

---

## 21. EVIDENCE PACKAGE

Create `docs/evidence/ORDER-001/REPORT.md` and supporting artifacts/references. The report must include:

- branch and final HEAD SHA;
- MR URL/IID;
- pipeline ID and job statuses;
- exact commands run and summarized pass/fail counts;
- D1 migration evidence;
- R2 media round-trip evidence;
- Access/admin protection evidence;
- public release-candidate URL;
- `/api/health` response showing exact SHA;
- E2E workflow evidence for public purchase path;
- admin create/publish/update evidence;
- import dry-run/apply/idempotency evidence;
- viewport screenshot paths;
- Lighthouse results;
- axe results;
- bundle size;
- catalog provenance counts (`instagram_public` vs `demo_generated`);
- known intentional deviations, if any, with reason and impact;
- `BLOCKED_REAL` evidence only if applicable.

Do not write “passed” without the corresponding fresh command/output/artifact.

---

## 22. OBJECTIVE ACCEPTANCE CRITERIA

`ARQ_DONE=YES` only if all are true:

1. Fresh remote state was reconstructed and implementation branch is descendant of the audited baseline.
2. Storefront, admin, API, D1 and R2 implementation exist in repo; no required surface is a mock screenshot or inert placeholder.
3. Public end-to-end shopping path works through a correctly encoded WhatsApp handoff.
4. Cart persists across reload.
5. Variant combinations and availability behave correctly.
6. No payment/card capture exists.
7. Admin is owner-usable and performs real catalog CRUD.
8. Admin publication changes appear publicly without frontend redeploy.
9. CSV/JSON import/export is real, tested and idempotent.
10. ERP canonical integration contract exists and all current writes converge on the same catalog service.
11. Product media uses R2 in release environment and responsive derivatives in storefront.
12. Catalog contains enough visually coherent content to demonstrate the store; real Instagram material is used where accessible and all inferred items are provenance-labeled internally.
13. Demo/proposal deployments clearly identify illustrative catalog if inferred content remains.
14. Admin is protected with Access; unauthenticated private requests fail.
15. Tests required in this order are green in a fresh run.
16. Core browser E2E passes on local/release candidate and actual deployed smoke passes.
17. Accessibility, responsive and performance gates meet thresholds or the evidence proves a genuinely external measurement limitation rather than a code defect.
18. No high/critical production dependency vulnerability remains without explicit evidence-based exception.
19. No committed secrets.
20. Release-candidate `/api/health` SHA equals the final branch HEAD being presented.
21. Evidence package is complete and auditable.
22. Draft MR exists against `main` and is not merged before AUD review.

If any criterion is false and not an externally demonstrated `BLOCKED_REAL`, the project is not done.

---

## 23. DEFINITION OF DONE

For this order, **DONE means a release-candidate that a real owner can operate and a real shopper can use end-to-end, deployed to a verifiable Cloudflare URL, with the exact source SHA traceable, but not yet merged/cut over to the owner’s final production domain until AUD audits it.**

The final ARQ checkpoint must use this exact status shape:

```text
ORDER=ORDER-001
RESULT=READY_FOR_AUDIT | BLOCKED_REAL
ARQ_DONE=YES | NO
BRANCH=<branch>
HEAD=<full sha>
MR=<iid/url>
PIPELINE=<id/status>
RELEASE_CANDIDATE_URL=<url>
HEALTH_SHA=<sha>
UNIT=<pass/fail counts>
INTEGRATION=<pass/fail counts>
E2E=<pass/fail counts>
AXE=<critical/serious counts>
LIGHTHOUSE=<P/A/BP/SEO + LCP/CLS>
CATALOG=<total/instagram/demo>
ADMIN_E2E=PASS|FAIL
WHATSAPP_E2E=PASS|FAIL
IMPORT_IDEMPOTENCY=PASS|FAIL
R2_MEDIA=PASS|FAIL
ACCESS_PROTECTION=PASS|FAIL
SECRET_SCAN=PASS|FAIL
PRODUCTION_MUTATION=NO
BLOCKER=<NONE or exact externally evidenced blocker>
EVIDENCE=docs/evidence/ORDER-001/REPORT.md
```

After ARQ publishes this checkpoint, stop implementation churn and hand control back to AUD for independent audit.
