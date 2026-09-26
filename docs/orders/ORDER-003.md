# ORDER-003 — REBECA FINAL PRODUCT + RELEASE CLOSURE

Issued by: AUD
Project: REBECA-SF
Canonical repository: `https://github.com/simondalmasso/rebeca`
Downstream mirror: `https://gitlab.com/simondalmasso/rebeca-sf`
Issued from canonical HEAD: `3f984da1b7427cc20dfa2083f9b6b1de26a1669a`
Target branch: `main`
Execution branch: `feat/order-003-final-close`
Authority: this is the single closure order for REBECA. It supersedes the unfinished execution portions of ORDER-002 where they conflict, while preserving its security, no-payment, KV, evidence, project-purity and exact-SHA requirements.

## 0. EXECUTIVE DIRECTIVE

Close REBECA.

Do not start another architecture tranche.
Do not replatform to Next.js, Shopify, Saleor, Vendure, Spree, Medusa or WordPress.
Do not rewrite the backend.
Do not revisit D1/R2.
Do not add payment/card collection.
Do not invent a production WhatsApp number.
Do not develop directly in GitLab.
Do not stop at "design ready", "Access pending", "deploy prepared" or another handoff checkpoint.

The existing React + Vite + Hono + Workers KV implementation is the product to finish.

ORDER-003 authorizes one bounded visual/product refinement pass, then requires full release closure:

```text
current implementation
  -> bounded UX/design audit
  -> one coherent visual direction
  -> implement on existing stack
  -> fresh GitHub CI
  -> Cloudflare Access
  -> exact-SHA deploy
  -> remote public/admin/media/import acceptance
  -> final evidence
  -> READY_FOR_FINAL_AUDIT
```

## 1. SOURCE OF TRUTH

Canonical source:
`https://github.com/simondalmasso/rebeca`

GitLab is downstream mirror only:
`https://gitlab.com/simondalmasso/rebeca-sf`

Server-side mirror:
`.github/workflows/mirror-gitlab.yml`

The mirror is already proven and must remain server-side. Never add a PC, Remote Desktop, SentinelX or local scheduler dependency.

At order issue time:
- GitHub main: `3f984da1b7427cc20dfa2083f9b6b1de26a1669a`
- GitHub -> GitLab mirror: proven
- STORE_KV: `616f4a65e5ab4629a8bb281ecc18a22c`
- MEDIA_KV: `a83b4db8a6ad4b3e91dbe900db088cdc`
- deterministic 14-product / 14-media seed: committed
- release WhatsApp destination: intentionally unconfigured/demo
- unresolved mandatory release area: Access + exact-SHA deploy + remote acceptance + evidence

Start from latest `main` containing this order, not from an old GitLab feature branch.

## 2. RESEARCH DECISION — CLOSED

Research is complete enough. Do not spend another tranche collecting inspiration.

Fashion/UX reference set:
- Zara / SSENSE: image-led editorial merchandising and restraint
- Nike: campaign-to-commerce continuity and merchandising
- Everlane: PDP clarity and objection reduction
- ASOS: mobile catalog density, filters and variant flow
- Adidas / Levi's: PDP hierarchy, size/fit and mobile purchase clarity

Code/architecture reference set:
- Vercel Commerce: storefront component/data separation and optimistic cart patterns
- Shopify Hydrogen: cart/data/cache/testing discipline
- Saleor: product/variant/admin domain modeling
- Vendure: Shop/Admin separation and extensibility discipline

These are references only. Copy patterns, not codebases, trademarks, proprietary imagery or operational complexity.

WordPress `wordpress-develop` is useful only as a reference for admin/tooling/test discipline.
Google `artemis` is useful only as optional QA/agentic testing inspiration.
Neither is a REBECA runtime architecture.

## 3. PRODUCT/DESIGN CANON

The final direction is named:

`REBECA EDITORIAL COMMERCE`

Do not generate three unrelated product identities and wait for selection. The direction is already chosen.

Design intent:
- fashion-first and image-led
- calm, premium, editorial, mobile-first
- clear commerce hierarchy
- no generic SaaS dashboard look in storefront
- no over-animation
- no hidden purchase controls
- accessibility and discoverability override decorative minimalism
- preserve real REBECA identity/assets already in repo; do not fabricate a new logo or fake brand facts

Use the current design tokens as the starting point. Refinement is allowed where it materially improves hierarchy, consistency, readability or commerce UX.

### Required storefront behaviors

Home:
- unmistakable Rebeca identity/header
- editorial hero with explicit commerce CTA
- clear category/collection entry
- featured/new product grid using real seeded catalog
- intentional whitespace and image hierarchy
- no fake reviews, fake urgency or fabricated claims

Catalog/PLP:
- mobile-first filter/sort control
- clean product cards
- variant/color cues only when backed by data
- stable responsive grid
- no horizontal overflow
- preserve URL/deep-link behavior

PDP:
- product imagery dominates appropriately
- product name/price/status remain immediately understandable
- variant and size selection adjacent to primary CTA
- unavailable states explicit
- fit/size/material/details shown only from real data
- shipping/return language must not invent store policy; if data is unavailable, omit or use clearly generic demo copy only where existing product contract permits
- sticky mobile purchase action where it improves the existing flow
- media carousel/gallery must be keyboard/touch usable

Cart:
- editable quantity/removal
- variant identity visible
- subtotal/summary clear
- no payment controls
- route to checkout remains coherent

Checkout:
- order summary
- explicit WhatsApp handoff model
- if `whatsappNumber=null`, release must not open a fake destination
- clearly communicate demo/unconfigured handoff state when applicable
- no card/payment fields

Admin:
- functional clarity over editorial styling
- CRUD/categories/settings/import/export/media must remain fast and legible
- no redesign that weakens operational density
- preserve all working persistence behavior

## 4. DESIGN TOOL ROUTING

Use design tools to accelerate closure, not create a parallel project.

### Superdesign — primary visual refinement
- analyze the existing codebase first
- initialize/reuse repo design context as required by the tool
- use the existing implementation as the structural target
- create/refine one `REBECA EDITORIAL COMMERCE` direction
- focus on Home + PLP + PDP + Cart/Checkout + shared shell
- preserve existing routes/data contracts
- do not scaffold a replacement application

### UX Pilot — secondary UX validation
Use for:
- mobile and desktop flow review
- conversion/clarity review
- hierarchy/accessibility issues
- optional compact flow/design review artifacts

Do not treat UX Pilot output as a new source tree.

### Product Design
Use for focused audit of the implemented shopper journey and obvious friction.
Do not reopen product strategy.

### Thoughtfulbits / SPARK
One final product-quality review is useful after implementation.
It is advisory; concrete reproduced defects must be fixed, subjective score-chasing is not a release gate.

### Skillquiver / verification
Use verification-before-completion and relevant test discipline before any "done" claim.

Tool/plugin unavailability is not a release blocker. Fall back to repo inspection + browser/E2E evidence.

## 5. EXECUTION CONTRACT

ARQ owns implementation.

Create:
`feat/order-003-final-close`

Open a Draft GitHub PR to `main`.

No merge.

The PR must remain Draft until independent final AUD.

Do not branch from legacy GitLab work. Do not modify the old GitLab MR except as historical downstream state.

## 6. PHASE A — RECONSTRUCT + BASELINE

Before changing code:
1. fetch latest GitHub `main`
2. verify this ORDER-003 exists
3. verify mirror workflow exists
4. verify KV binding IDs
5. verify seed script
6. verify no committed credentials
7. scan TODO/FIXME/not-implemented
8. identify current routes/components for Home/PLP/PDP/cart/checkout/admin
9. run current tests/build once
10. capture baseline screenshots of the actual implementation if runnable

Do not redo already-proven KV provisioning unless current evidence proves it broken.

## 7. PHASE B — BOUNDED UI/UX REFINEMENT

Audit current implementation against the canon in §3.

Make only high-leverage changes.

Priority order:
1. mobile shell/header/navigation
2. Home hierarchy
3. PLP density/filter ergonomics
4. PDP imagery + variant/size/CTA hierarchy
5. cart clarity
6. checkout/WhatsApp handoff clarity
7. responsive consistency
8. admin polish only where there is clear friction

Do not add:
- accounts
- wishlists requiring persistence
- reviews backend
- loyalty
- payments
- promotions engine
- shipping integrations
- CMS
- analytics
- recommendations engine
- fake social proof
- fake stock pressure
- speculative ERP features

## 8. PHASE C — PRESERVE ARCHITECTURE

Keep:
- React 19
- Vite
- React Router
- Hono Worker
- Workers KV
- STORE_KV canonical state
- MEDIA_KV binary/media state
- Zod validation
- current canonical DTOs
- CatalogService/import-export seam
- Cloudflare Workers release target

No Next.js migration.
No framework migration.
No database migration.

Patterns from external repos may improve organization, tests, loading states, cart UX or component boundaries only when the change is small and directly justified.

## 9. PHASE D — GITHUB CI BECOMES CURRENT

GitHub is canonical, so final validation cannot rely only on legacy GitLab pipeline #39.

Create or refresh GitHub Actions CI to run the applicable current commands:

```text
npm ci
npm run typecheck
npm run lint
npm run format:check
npm run test:unit
npm run test:integration
npm run build
npm run secret:scan
npm run audit:prod
npm run e2e
Lighthouse / equivalent retained project gate
```

Reuse current project scripts and proven test setup. Do not invent a second CI architecture.

The mirror workflow remains separate.

Final PR SHA must have fresh green GitHub CI.

## 10. PHASE E — CLOUDFLARE ACCESS

Protect admin only.

Canonical hostname:
`rebeca-sf.simondalmasso44.workers.dev`

Protected destinations must cover exact parent + descendants:

```text
/admin
/admin/*
/api/admin
/api/admin/*
```

Public routes must remain public, including:
- `/`
- catalog/category/product routes
- cart/checkout
- `/api/catalog*`
- `/api/health`
- `/media/*`

Do not protect the whole Worker.

Initial authorized admin may use the verified current owner identity already available to the account. Do not invent additional identities.

Capture actual:
- Access app name/id
- team domain
- audience tag(s)

If multiple Access apps/audiences are required, use validated `CF_ACCESS_AUDS`; no wildcard audience.

Required proof:
- anonymous `/admin` challenged/denied
- anonymous descendant challenged/denied
- anonymous `/api/admin/products` unusable
- authenticated admin reaches admin
- authenticated mutation persists
- public storefront still anonymous/public

## 11. PHASE F — RELEASE DEPLOY

Deploy the exact final code/evidence HEAD to:

`https://rebeca-sf.simondalmasso44.workers.dev/`

Required vars/config:
- `ENVIRONMENT=release`
- `BUILD_SHA=<exact final GitHub HEAD>`
- correct public/admin origins
- actual Access team/audience config
- existing STORE_KV/MEDIA_KV bindings

Interactive authorized Wrangler is allowed.

Do not require a GitLab CI Cloudflare token.

## 12. PHASE G — REMOTE ACCEPTANCE

Against the canonical production URL verify:

Public:
- home
- catalog/PLP
- category/deep links
- PDP
- variants
- cart persistence
- checkout summary
- WhatsApp handoff behavior
- media
- health
- catalog = 14 published demo products unless a verified intentional catalog edit changes that count

Responsive:
- mobile 390x844
- desktop 1440x900
- no material console errors
- no page errors
- no horizontal overflow

Admin:
- authenticated access
- product edit/create/update
- publish/status change
- public reflection without frontend rebuild
- category/settings behavior
- media upload/read/reorder/delete
- import preview
- import apply
- repeated import idempotency

Restore demo catalog to coherent final state after destructive acceptance tests.

## 13. QUALITY GATES

Fresh final gates:
- typecheck PASS
- lint PASS
- format PASS
- unit PASS
- integration PASS
- build PASS
- secret scan PASS
- production dependency audit: no high/critical production vulnerability
- E2E PASS
- axe: 0 critical / 0 serious on required surfaces
- Lighthouse:
  - Performance >= 90
  - Accessibility >= 95
  - Best Practices >= 95
  - SEO >= 90
  - CLS <= 0.1
  - meaningful mobile LCP target <= 2.5s

Do not lower thresholds to close the order.

## 14. FINAL EVIDENCE

Create exactly:
`docs/evidence/ORDER-003/REPORT.md`

Do not spend time backfilling a separate ORDER-002 report if ORDER-003 contains the final authoritative evidence.

REPORT must include:
- ORDER-003
- branch
- final HEAD
- Draft PR URL/state
- GitHub CI run IDs/status
- GitHub->GitLab mirror run/status
- GitLab mirrored SHA equality proof
- test counts
- axe/Lighthouse
- security/audit results
- screenshots/artifact paths
- concise UX/design changes
- design-tool artifacts/links if used
- STORE_KV and MEDIA_KV binding names/IDs
- Access app/path/audience proof
- canonical URL
- exact health JSON
- public shopper walkthrough
- authenticated admin mutation/public reflection proof
- media proof
- import idempotency
- catalog count/provenance
- WhatsApp release state
- PAYMENT_GATEWAY=ABSENT
- R2_ACTIVATED=NO
- D1_MUTATION=NO
- UNRELATED_PROJECT_MUTATION=NO
- Firebase mirror status
- known genuine non-blocking limitations

No secrets.

## 15. CRITICAL FINAL-SHA RULE

Evidence commits change HEAD.

Therefore:
1. complete implementation
2. complete acceptance evidence
3. commit/push report
4. determine definitive final GitHub HEAD
5. run final required GitHub CI on that HEAD
6. deploy that exact HEAD
7. verify `/api/health.sha == final GitHub HEAD`
8. verify GitHub->GitLab mirror of the relevant final ref/state
9. only then return to AUD

No stale deploy SHA is acceptable.

## 16. FIREBASE

Firebase mirror remains non-blocking.

Only after canonical Cloudflare PASS:
- update `rebeca-sf.web.app` if trivial and credentials exist
- otherwise record `DEFERRED_NON_BLOCKING`

Do not delay release closure for Firebase.

## 17. PROJECT PURITY

Never inspect/mutate/delete/reuse infrastructure belonging to unrelated projects.

No:
- ZUNGUN
- SENEX
- VOY
- SOS
- MONEYKILLER
- ATM
- or any other unrelated project

Repo text search for contamination is allowed. Cross-project infrastructure exploration is not.

## 18. STOP CONDITIONS

Do not stop for:
- design-tool outage
- UX Pilot/Superdesign unavailable
- no Firebase credential
- no production WhatsApp number
- missing GitLab Cloudflare CI token
- old GitLab MR state
- D1 slot
- R2 activation
- another desire to refactor

Only return `BLOCKED_REAL` for a demonstrated external restriction that actually prevents the next mandatory release action after safe troubleshooting.

Preserve exact provider error/code/evidence.

## 19. DEFINITION OF DONE

ORDER-003 is DONE only when:

- REBECA looks intentionally designed, not like an unfinished prototype
- shopper flow is coherent mobile + desktop
- existing architecture is preserved
- fresh GitHub CI is green
- server-side GitHub->GitLab mirror remains healthy
- Cloudflare Access protects admin UI/API only
- canonical Worker is publicly reachable
- `/api/health.sha` equals final GitHub HEAD
- catalog/media work remotely
- cart/checkout work
- no payment gateway exists
- no fake WhatsApp destination is used
- admin CRUD persists remotely
- media round-trip works remotely
- import is idempotent
- evidence is committed
- Draft PR remains unmerged
- independent AUD can verify the release without another reconstruction/handoff

## 20. FINAL ARQ RETURN CONTRACT

Return only one of:

`READY_FOR_FINAL_AUDIT`
or
`BLOCKED_REAL`

Required final fields:

```text
ORDER=ORDER-003
RESULT=READY_FOR_FINAL_AUDIT|BLOCKED_REAL
ARQ_DONE=YES|NO
BRANCH=feat/order-003-final-close
HEAD=<full sha>
PR=<url/state>
GITHUB_CI=<run/status>
GITLAB_MIRROR=<run/status/sha-match>
RELEASE_URL=https://rebeca-sf.simondalmasso44.workers.dev/
HEALTH_SHA=<sha>
DESIGN_DIRECTION=REBECA_EDITORIAL_COMMERCE
UX_REMOTE=PASS|FAIL
E2E_REMOTE_PUBLIC=PASS|FAIL
ADMIN_REMOTE=PASS|FAIL
MEDIA_REMOTE=PASS|FAIL
ACCESS_PROTECTION=PASS|FAIL
IMPORT_IDEMPOTENCY=PASS|FAIL
CATALOG=<total/demo>
WHATSAPP_RELEASE_DESTINATION=CONFIGURED|UNCONFIGURED_DEMO
AXE=<critical/serious>
LIGHTHOUSE=<P/A/BP/SEO + LCP/CLS>
SECRET_SCAN=PASS|FAIL
PROD_AUDIT=PASS|FAIL
PAYMENT_GATEWAY=ABSENT
R2_ACTIVATED=NO
D1_MUTATION=NO
UNRELATED_PROJECT_MUTATION=NO
FIREBASE_MIRROR=PASS|DEFERRED_NON_BLOCKING
BLOCKER=<NONE or exact blocker>
EVIDENCE=docs/evidence/ORDER-003/REPORT.md
```

## 21. ARQ HANDOFF PROMPT

```text
PROJECT=REBECA-SF
ROLE=ARQ
ORDER=ORDER-003
MODE=FINAL_PRODUCT_AND_RELEASE_CLOSURE
CANON=https://github.com/simondalmasso/rebeca
ORDER_URL=https://github.com/simondalmasso/rebeca/blob/main/docs/orders/ORDER-003.md

Execute ORDER-003 end-to-end from latest GitHub main. Preserve React/Vite/Hono/Workers-KV architecture. Implement the single REBECA_EDITORIAL_COMMERCE direction using the existing product and the bounded reference set in the order; do not replatform. Create feat/order-003-final-close + Draft GitHub PR, add fresh GitHub CI, finish Cloudflare Access, deploy exact final SHA, run remote shopper/admin/media/import/axe/Lighthouse acceptance, commit docs/evidence/ORDER-003/REPORT.md, redeploy the definitive evidence HEAD so /api/health.sha equals it, verify the server-side GitHub->GitLab mirror, and return only READY_FOR_FINAL_AUDIT or a proven BLOCKED_REAL. No merge. No intermediate handoff.
```

Recommended task tools:
`@GitHub @01-superdesign @ux-pilot @Product Design @thoughtfulbits-skills @Skillquiver`
