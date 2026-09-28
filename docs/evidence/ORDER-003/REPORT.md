# ORDER-003 — FINAL RELEASE EVIDENCE

STATUS: FINALIZATION_IN_PROGRESS
PROJECT: REBECA-SF
CANON: https://github.com/simondalmasso/rebeca
BRANCH: feat/order-003-final-close
PR: https://github.com/simondalmasso/rebeca/pull/1 (Draft, unmerged)
RELEASE_URL: https://rebeca-sf.simondalmasso44.workers.dev/
DESIGN_DIRECTION: REBECA_EDITORIAL_COMMERCE
PRIMARY_VIEWPORT: 390x844
SECONDARY_VIEWPORT: 1440x900

## Implemented
- Mobile-first editorial storefront refinement over existing React/Vite/Hono/Workers-KV stack.
- Compact mobile header/menu, image-led Home, compact PLP/filter sheet, horizontal-snap PDP gallery and earlier variant/CTA access.
- Clearer cart/checkout and honest unconfigured WhatsApp release state.
- Admin stale D1/R2 copy corrected to Workers KV.
- GitHub Actions CI added as current canonical quality gate.
- Owner override: Cloudflare Zero Trust/Access is NOT used.
- Worker-native HTTP Basic Auth protects /admin* and /api/admin*. ADMIN_PASSWORD is a Cloudflare Worker secret and is not committed.

## Storage / release bindings
- STORE_KV=616f4a65e5ab4629a8bb281ecc18a22c
- MEDIA_KV=a83b4db8a6ad4b3e91dbe900db088cdc
- Catalog seed: 14 demo products / 14 demo media, provenance demo_generated.
- WhatsApp release destination: UNCONFIGURED_DEMO (whatsappNumber=null).
- Payment gateway: ABSENT.
- D1 mutation: NO.
- R2 activated: NO.
- Unrelated project mutation: NO.
## GitHub CI evidence
Exact implementation SHA used for full pre-report release acceptance:
`b834721610171646774e0e4f515f639f523f6909`

GitHub Actions CI:
- Run: 36397610000
- verify: PASS
- typecheck: PASS
- lint: PASS (0 errors; existing warnings only)
- format: PASS
- unit: 8/8 PASS
- integration: PASS
- build: PASS
- secret scan: PASS
- production dependency audit: PASS
- browser E2E: 6/6 PASS
- Lighthouse gate: PASS
- Lighthouse: P99 / A100 / BP100 / SEO91
- LCP: 1797 ms
- CLS: 0.000
- Browser artifact: 10958961652

Note: `npm ci` reports 7 vulnerabilities in the full dev dependency graph; `npm run audit:prod` is the release security gate and passed.

## Cloudflare deploy / health
Initial production acceptance deploy:
- Worker: rebeca-sf
- Cloudflare Version ID: 3236c853-018e-40e8-9067-b7a6ac90e1b6
- Deployed SHA: b834721610171646774e0e4f515f639f523f6909
- Health:
  `{"ok":true,"sha":"b834721610171646774e0e4f515f639f523f6909","environment":"release","storage":"kv","store":"ok","media":"ok"}`
- Catalog count: 14
- Store/media health: ok/ok

The commit containing this report changes HEAD. Per ORDER-003, after this evidence commit the definitive HEAD is rerun through CI and redeployed, then runtime /api/health.sha is verified externally to equal that definitive HEAD without creating another evidence commit.
## Remote acceptance
Public shopper:
- Home public: PASS
- PLP /tienda: PASS
- PDP /producto/top-alba: PASS
- Variant M / Negro selectable: PASS
- Add to cart: PASS
- Cart persistence/content: PASS
- Checkout: PASS
- No fake WhatsApp destination: PASS
- Mobile 390x844 horizontal overflow: 0 on Home/PLP/PDP/Cart/Checkout
- Desktop 1440x900 horizontal overflow: 0
- Material console errors: 0
- Page errors: 0

Admin auth:
- Anonymous /api/admin/products: 401 PASS
- Wrong Basic credentials: 401 PASS
- Anonymous /admin challenge: 401 + WWW-Authenticate Basic PASS
- Authenticated /admin UI: PASS
- Admin dashboard title: Resumen
- Admin runtime copy shows Workers KV: PASS

Admin mutation/public reflection:
- top-alba edited remotely: PASS
- change reflected through public product API: PASS
- original state restored: PASS

Media:
- temporary WebP upload: PASS
- public media read: HTTP 200, image/webp, 5808 bytes
- reorder: PASS
- original order restored: PASS
- temporary media deleted: PASS
Import idempotency:
- preview: create=0 update=1 skip=0 errors=0
- first apply: create=0 update=1 skip=0 errors=0
- second apply: create=0 update=0 skip=1 errors=0
- IDEMPOTENT=PASS
- product restored after acceptance: PASS

Accessibility live:
- /: 0 critical / 0 serious
- /tienda: 0 critical / 0 serious
- /producto/top-alba: 0 critical / 0 serious
- /carrito: 0 critical / 0 serious
- /checkout: 0 critical / 0 serious

## Live screenshots
- screenshots/mobile-home.png
- screenshots/mobile-shop.png
- screenshots/mobile-pdp.png
- screenshots/mobile-cart.png
- screenshots/mobile-checkout.png
- screenshots/desktop-home.png
- screenshots/desktop-admin.png

## Tool/design evidence
- Superdesign project: 8d66183f-6c86-46a3-b893-646a7cbe3d19
- Superdesign mobile baseline draft: 943336f6-c7d3-4205-bc15-fb38a6a3a7d6
- MiroMiro was unavailable due account monthly quota; it was not treated as a release blocker.
## Mirror state / remaining external gate
GitHub remains the canonical source.
Server-side workflow: .github/workflows/mirror-gitlab.yml
Downstream: https://gitlab.com/simondalmasso/rebeca-sf

The mirror architecture exists, but GITLAB_MIRROR_TOKEN is currently invalid/expired.
- Latest proven failure class: GitLab HTTP Basic authentication failed from GitHub Actions.
- No host-based/local mirror was added.
- The GitLab connector available to this execution can write repository data but cannot create/access project tokens.
- The dedicated Brave session is not authenticated to GitLab and no new login is performed automatically.
- Required owner/auth action if still unresolved: create/rotate a GitLab credential scoped to write_repository for rebeca-sf and replace GitHub Actions secret GITLAB_MIRROR_TOKEN; rerun mirror workflow and prove SHA equality.

## Firebase
DEFERRED_NON_BLOCKING.

## Finalization rule
Before final AUD:
1. Commit this report + screenshots.
2. Require fresh GitHub CI green on the definitive branch HEAD.
3. Deploy that exact HEAD to rebeca-sf with BUILD_SHA=<HEAD>.
4. Verify /api/health.sha == definitive HEAD and public/admin protection remains healthy.
5. Repair and prove GitHub->GitLab mirror if credential authority is available.
6. Keep PR Draft/unmerged.
