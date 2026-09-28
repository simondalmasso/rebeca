# ORDER-003 — FINAL RELEASE EVIDENCE

STATUS: FINAL_EVIDENCE_COMMITTED_PENDING_EXACT_SHA_REDEPLOY
PROJECT: REBECA-SF
CANON: https://github.com/simondalmasso/rebeca
BRANCH: feat/order-003-final-close
PR: https://github.com/simondalmasso/rebeca/pull/1 (Draft, unmerged)
RELEASE_URL: https://rebeca-sf.simondalmasso44.workers.dev/
DESIGN_DIRECTION: REBECA_EDITORIAL_COMMERCE
PRIMARY_VIEWPORT: 390x844
SECONDARY_VIEWPORT: 1440x900

## Product / architecture
- Mobile-first editorial storefront refinement completed on the existing React/Vite/Hono/Workers-KV stack.
- Compact mobile header/menu, image-led Home, compact PLP/filter sheet, horizontal-snap PDP gallery, earlier variant/CTA access, clearer cart/checkout.
- No replatform, no payment gateway, no D1/R2 release dependency.
- Owner override: Cloudflare Zero Trust/Access is NOT used.
- Worker-native HTTP Basic Auth protects /admin* and /api/admin*.
- ADMIN_PASSWORD is stored only as a Cloudflare Worker secret and is not committed.

## Storage / catalog
- STORE_KV=616f4a65e5ab4629a8bb281ecc18a22c
- MEDIA_KV=a83b4db8a6ad4b3e91dbe900db088cdc
- Catalog: 14 demo products / 14 demo media.
- Provenance restored after remote acceptance: demo_generated / rebeca-demo-v1.
- WhatsApp release destination: UNCONFIGURED_DEMO (whatsappNumber=null).
- Payment gateway: ABSENT.
- D1 mutation: NO.
- R2 activated: NO.
- Unrelated project mutation: NO.

## GitHub CI evidence
Implementation SHA used for full runtime acceptance before final evidence commit:
`b834721610171646774e0e4f515f639f523f6909`

GitHub Actions CI run 36397610000:
- verify: PASS
- typecheck: PASS
- lint: PASS (0 errors; warnings only)
- format: PASS
- unit: 8/8 PASS
- integration: PASS
- build: PASS
- secret scan: PASS
- production dependency audit: PASS
- browser E2E: 6/6 PASS
- axe serious/critical: 0/0 on tested surfaces
- Lighthouse gate: PASS
- CI Lighthouse: P99 / A100 / BP100 / SEO91
- CI LCP: 1797 ms
- CI CLS: 0.000

Note: `npm ci` reports 7 vulnerabilities in the full dev dependency graph; `npm run audit:prod` is the production release gate and passed.

## Production deploy / health
Pre-final-evidence production acceptance deploy:
- Worker: rebeca-sf
- Cloudflare Version ID: 3236c853-018e-40e8-9067-b7a6ac90e1b6
- Deployed SHA: `b834721610171646774e0e4f515f639f523f6909`
- Health: `{"ok":true,"sha":"b834721610171646774e0e4f515f639f523f6909","environment":"release","storage":"kv","store":"ok","media":"ok"}`
- Catalog count: 14
- Home: HTTP 200
- Anonymous /admin: HTTP 401 + Basic challenge
- Anonymous /api/admin/products: HTTP 401

The commit containing this report is the definitive evidence commit candidate. After it is committed, no further documentation/evidence commits are expected. The exact branch HEAD containing this report must pass fresh CI, be deployed with BUILD_SHA=<that HEAD>, and then /api/health.sha must equal that HEAD.

## Remote acceptance
Public shopper:
- Home: PASS
- PLP /tienda: PASS
- PDP /producto/top-alba: PASS
- Variant M / Negro selectable: PASS
- Add to cart: PASS
- Cart persistence: PASS
- Checkout: PASS
- Unconfigured WhatsApp state shown honestly: PASS
- Fake WhatsApp destination: ABSENT
- Payment/card fields: 0
- Mobile 390x844 overflow: 0 on Home/PLP/PDP/Cart/Checkout
- Desktop 1440x900 overflow: 0
- Material console errors: 0
- Page errors: 0

Admin/auth:
- Anonymous admin UI/API rejected: PASS
- Wrong Basic credentials rejected: PASS
- Authenticated admin API list: 14 products
- Top Alba reversible edit: PASS
- Public reflection of edit: PASS
- Original product content restored: PASS

Media:
- Temporary WebP upload: HTTP 201 PASS
- Public media read: HTTP 200 / image/webp PASS
- SHA-256: ee85cd0678ac84e42f628d539bd39a43b19c281b5f89a65f6f282811d539870b
- Reorder: PASS
- Temporary media delete: PASS
- Final media count restored to original: PASS

Import idempotency:
- preview: create=0 update=1 skip=0
- first apply: create=0 update=1 skip=0
- public reflection: PASS
- second apply: create=0 update=0 skip=1
- product content/provenance restored: PASS
- IDEMPOTENT=PASS

Accessibility live:
- /: 0 critical / 0 serious
- /tienda: 0 critical / 0 serious
- /producto/top-alba: 0 critical / 0 serious
- /carrito: 0 critical / 0 serious
- /checkout: 0 critical / 0 serious

## Production Lighthouse
Run against the live Cloudflare Worker using the dedicated Brave CDP session:
- Performance: 99
- Accessibility: 100
- Best Practices: 100
- SEO: 92
- LCP: 1716 ms
- CLS: 0.025
- Summary artifact: `docs/evidence/ORDER-003/lighthouse-production-summary.json`

## Screenshots
Fresh production screenshots:
- `screenshots/remote-mobile-home.png`
- `screenshots/remote-mobile-pdp.png`
- `screenshots/remote-mobile-cart.png`
- `screenshots/remote-mobile-checkout.png`
- `screenshots/remote-desktop-home.png`

Additional existing release screenshots:
- `screenshots/mobile-home.png`
- `screenshots/mobile-shop.png`
- `screenshots/mobile-pdp.png`
- `screenshots/mobile-cart.png`
- `screenshots/mobile-checkout.png`
- `screenshots/desktop-home.png`
- `screenshots/desktop-admin.png`

## Design/tool evidence
- Superdesign project: 8d66183f-6c86-46a3-b893-646a7cbe3d19
- Superdesign mobile baseline draft: 943336f6-c7d3-4205-bc15-fb38a6a3a7d6
- MiroMiro unavailable due account monthly quota; not a release blocker.

## Mirror state / remaining external gate
GitHub is canonical.
Server-side mirror workflow: `.github/workflows/mirror-gitlab.yml`
Downstream: https://gitlab.com/simondalmasso/rebeca-sf

Current mirror credential state:
- `GITLAB_MIRROR_TOKEN` is invalid/expired.
- Proven failure class: GitLab HTTP Basic authentication failed from GitHub Actions.
- No host-based/local mirror was added.
- Available GitLab connector can inspect/write repository data but cannot create a project/deploy token.
- Dedicated Brave profile is not authenticated to GitLab and no new login is performed automatically.

Required mirror closure:
1. Create/rotate a GitLab credential scoped only as needed for `write_repository` on rebeca-sf.
2. Replace GitHub Actions secret `GITLAB_MIRROR_TOKEN`.
3. Rerun mirror workflow.
4. Prove GitHub target SHA == GitLab target SHA.

## Firebase
DEFERRED_NON_BLOCKING.

## Finalization rule
After this report commit:
1. Resolve definitive branch HEAD with `git rev-parse origin/feat/order-003-final-close`.
2. Require fresh GitHub CI verify + browser + Lighthouse SUCCESS on that exact HEAD.
3. Deploy that exact HEAD to Worker `rebeca-sf` with `BUILD_SHA=<HEAD>`.
4. Verify `/api/health.sha == HEAD`, health ok, catalog=14, Home=200, anonymous admin=401.
5. Do not create another repo commit unless a real defect is found.
6. Repair/prove GitHub->GitLab mirror if token authority becomes available.
7. Keep PR Draft/unmerged until independent AUD.
