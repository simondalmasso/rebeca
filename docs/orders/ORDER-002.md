# ORDER-002 — REBECA-SF FINALIZE + DEPLOY FAST-PATH

Issued by: AUD 🧠
Project: REBECA-SF
Repository: `simondalmasso/rebeca-sf`
Authority: supersedes only the remaining release/infrastructure requirements of ORDER-001 where this document explicitly says so. All already-passing product behavior, security principles, UX, catalog semantics, no-payment rule, ERP seam and evidence-before-verdict rules remain in force.

## 0. EXECUTIVE DIRECTIVE

ARQ must finish REBECA-SF in one continuous tranche from the existing implementation checkpoint.

Do not restart the project.
Do not rebuild the UI.
Do not change projects.
Do not wait for R2.
Do not wait for a D1 slot.
Do not treat missing GitLab Cloudflare variables as a release blocker.
Do not add a payment gateway.
Do not merge the MR.

The target is a real, public, verifiable Cloudflare release candidate of the existing storefront plus working owner admin, using Cloudflare primitives that are available on Workers Free without the R2 subscription checkout or D1 database-count slot that blocked ORDER-001.

The release fast-path is:

```text
React/Vite storefront + admin
        |
Cloudflare Worker / Hono
        |
        +-- STORE_KV  -> canonical catalog/admin/settings/import state
        |
        +-- MEDIA_KV  -> owner-uploaded product media + release demo media
        |
        +-- Static Assets -> app bundles/fonts
        |
Cloudflare Access -> /admin* and /api/admin*
```

No payment/card collection exists. Checkout remains WhatsApp handoff only.

## 1. AUDITED STARTING POINT

Continue the existing branch and MR.

```text
BRANCH=feat/order-001-rebeca-v1
AUDITED_START_HEAD=ef0f8ee2834da81eecc428a1c1b5d6cf3e328417
MR=!1
TARGET=main
PIPELINE_AT_CHECKPOINT=2859443727 / SUCCESS
```

Verified at AUD checkpoint:

- unit: 8 passed / 0 failed
- integration: 11 passed / 0 failed
- browser E2E: 6 passed / 0 failed
- axe: 0 critical / 0 serious on exercised surfaces
- Lighthouse final pipeline: P97 / A100 / BP100 / SEO91, LCP 1824 ms, CLS 0.077
- secret scan clean
- production dependency audit 0 vulnerabilities
- MR open + draft + conflict-free at audited checkpoint
- no merge
- no canonical deploy
- no unrelated-project mutation
- no product-project contamination found in the audited scans

The implementation already has a functioning storefront, cart, variants, WhatsApp message builder, admin CRUD/import/export UI, local production-mode security checks, provenance/demo catalog and deployment scripts.

Therefore ORDER-002 is a closure order, not a second implementation project.

## 2. WHY THE INFRASTRUCTURE CHANGES

ORDER-001 selected D1 + R2 as the ideal long-term shape.

That is no longer the fastest zero-cost release path for this account:

- Workers Free currently permits 10 D1 databases per account.
- The audited account state reported no dedicated D1 slot available for REBECA.
- R2 requires an R2 subscription activation/checkout even though Standard includes a free usage allowance.
- GitLab CI has no Cloudflare API token, but an authorized interactive Wrangler session can deploy without forcing CI-secret setup first.
- Workers KV is available on Workers Free, supports up to 1,000 namespaces, 1 GB storage/account, 100,000 reads/day, 1,000 writes/day and values up to 25 MiB.

Official references current at issuance:

- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/r2/get-started/
- https://developers.cloudflare.com/kv/platform/limits/
- https://developers.cloudflare.com/kv/platform/pricing/
- https://developers.cloudflare.com/kv/get-started/
- https://developers.cloudflare.com/workers/ci-cd/external-cicd/gitlab-cicd/
- https://developers.cloudflare.com/workers/configuration/cloudflare-access/

This order intentionally removes D1 and R2 from the release critical path.

## 3. HARD ROLE / PROJECT BOUNDARY

ARQ authority is limited to REBECA-SF.

Allowed:

- `simondalmasso/rebeca-sf`
- Cloudflare resources created specifically for `rebeca-sf`
- GitLab MR !1 / pipelines for this project
- the existing Firebase REBECA mirror only if it is already configured and copying it is trivial

Forbidden:

- inspect, delete, repurpose, migrate or mutate D1/KV/R2/Workers belonging to SENEX, VOY, ZUNGUN, SOS, MONEYKILLER, ATM or any other project
- free a D1 slot by deleting another database
- reuse another project's database/bucket/namespace
- alter unrelated Cloudflare Workers
- “clean up” the Cloudflare account globally
- merge !1
- add billing/subscriptions/payment methods
- activate R2 checkout
- introduce a payment provider for the storefront

If a Cloudflare command would require listing unrelated resources, prefer creating the exact REBECA resource by name/binding directly. Listing solely to verify the exact REBECA resource after creation is allowed; account-wide archaeology is not.

## 4. BRANCH PROCEDURE

1. Fetch remote state.
2. Verify current feature HEAD equals or descends from `ef0f8ee2834da81eecc428a1c1b5d6cf3e328417`.
3. Read `origin/main:docs/orders/ORDER-002.md`.
4. Rebase the feature branch onto latest `origin/main` so ORDER-002 and governance are part of the final MR history.
5. Continue on the same branch `feat/order-001-rebeca-v1`.
6. Do not create a replacement MR unless !1 is externally broken beyond repair.
7. Force-push after rebase is allowed only to this feature branch and only with `--force-with-lease`.

After rebase, record the new base/head in evidence.

## 5. STORAGE ARCHITECTURE OVERRIDE

### 5.1 Runtime release backend

Replace release-runtime D1 and R2 dependencies with two dedicated Workers KV namespaces:

```text
binding: STORE_KV
purpose: canonical catalog/admin/settings/import/audit state

binding: MEDIA_KV
purpose: product image blobs and image metadata
```

Names must be REBECA-specific. Recommended resource titles:

```text
rebeca-sf-store
rebeca-sf-media
```

Use the actual IDs generated by Cloudflare in `wrangler.toml`.

### 5.2 D1 status

D1 code may remain as a future adapter/reference only if it does not inflate or confuse the runtime path.

Release configuration must not contain:

- the all-zero D1 UUID
- a required D1 binding
- a deployment guard that blocks because D1 is absent
- health checks that require D1

Preferred implementation:

- extract a repository contract from the current D1-bound service
- implement `KvStoreRepository`
- make `CatalogService` and `ImportService` depend on that repository contract
- keep the canonical DTOs and public/admin API shapes stable
- remove Drizzle/D1 from release-runtime dependencies if no runtime path uses them

Do not rewrite React surfaces because persistence changed.

### 5.3 R2 status

R2 is optional future infrastructure after this order.

Release must not:

- require R2 activation
- require `MEDIA:R2Bucket`
- call R2
- fail deploy because R2 is absent

Preserve the conceptual media adapter seam so an R2 adapter can be reintroduced later without rewriting product/editor contracts.

## 6. STORE_KV CANONICAL STATE

Use one versioned canonical state document small enough for KV.

Minimum shape:

```ts
type StoreStateV1 = {
  schemaVersion: 1;
  revision: number;
  products: AdminProduct[];
  categories: AdminCategory[];
  settings: StoreSettings;
  importRuns: ImportRunRecord[];
  auditEvents: AuditEvent[];
  updatedAt: string;
};
```

Key:

```text
store:state:v1
```

Rules:

- all admin writes read/validate current state, apply the mutation and write one complete next state
- increment `revision` for every catalog/settings/media-metadata mutation
- preserve integer centavos
- preserve current product/category/variant/status/source/demo semantics
- preserve import checksum/idempotency
- preserve audit event generation
- cap audit history to a sane bounded tail, e.g. latest 500 events
- do not persist customer checkout PII
- public API derives its response from this state and returns only published/active public fields
- state must validate through Zod before write and after read
- corrupted/invalid state must fail safely with a stable error rather than silently resetting the catalog

KV has a same-key write rate limit. Admin is single-owner, low-write. Prevent accidental rapid duplicate saves:

- disable save while mutation is in flight
- return a stable `write_rate_limited` error on KV rate limit
- client may retry once after >1 second
- import apply must compute all changes in memory and perform one final state write, not one state write per row

No distributed multi-user editing system is required.

## 7. MEDIA_KV

Keep the existing browser-side derivative strategy.

For each accepted upload:

- validate MIME/signature
- max raw owner upload remains 10 MB
- generate storefront derivatives client-side as already designed
- never store SVG/executable content
- write each binary derivative directly to `MEDIA_KV`
- store content type, SHA-256, dimensions and role in KV metadata and canonical store state
- use deterministic REBECA-only keys such as:

```text
media/<productId>/<mediaId>/original.<ext>
media/<productId>/<mediaId>/720.webp
media/<productId>/<mediaId>/1440.webp
```

`/media/*` must:

- read the exact key from `MEDIA_KV`
- reject traversal/invalid key forms
- preserve content type
- set immutable cache headers for content-addressed or immutable media keys
- return 404 for missing objects

Deletion must remove corresponding KV media keys and media metadata.

Reorder changes metadata/state only.

## 8. RELEASE SEED / DEMO MEDIA

The existing 14 demo products remain valid proposal content.

Do not invent real Rebeca inventory.

Create a deterministic release seeding script, for example:

```text
scripts/build-kv-release-seed.mjs
```

It must:

1. read `data/demo-catalog.json`
2. read `data/catalog-source-manifest.json`
3. read committed demo media source files
4. construct one valid `StoreStateV1`
5. assign deterministic or generated product/media IDs consistently
6. produce a remote KV seed artifact for `STORE_KV`
7. produce a Wrangler KV bulk artifact for `MEDIA_KV`
8. preserve `demo_generated` provenance
9. leave `demoMode=true`
10. never label demo data as real stock

Remote seed must use official Wrangler KV commands with `--remote`.

Examples allowed:

```bash
npx wrangler kv namespace create STORE_KV --binding STORE_KV --update-config
npx wrangler kv namespace create MEDIA_KV --binding MEDIA_KV --update-config

npx wrangler kv key put --binding=STORE_KV "store:state:v1" --path=<generated-state-file> --remote
npx wrangler kv bulk put <generated-media-bulk-file> --binding=MEDIA_KV --remote
```

Adapt syntax to the installed Wrangler version rather than copying blindly.

After seeding, read back and validate state/media sentinel before deployment is considered ready.

## 9. API COMPATIBILITY

Keep existing client-facing contracts stable wherever possible.

Required public endpoints:

- `GET /api/catalog`
- `GET /api/catalog/products/:slug`
- `GET /api/store-settings/public`
- `GET /api/health`
- `GET /media/*`

Required admin functions remain:

- product CRUD/status/duplicate
- category CRUD/activation/order as currently implemented
- settings
- JSON/CSV import preview/apply
- JSON/CSV export
- media upload/remove/reorder

Do not make the frontend know whether storage is D1, KV or future ERP.

## 10. HEALTH CONTRACT

Replace DB-specific health with release-storage health.

Minimum response:

```json
{
  "ok": true,
  "sha": "<exact git sha>",
  "environment": "release",
  "storage": "kv",
  "store": "ok",
  "media": "ok"
}
```

`store=ok` requires a valid readable `store:state:v1`.

`media=ok` requires at least one known release media key or an explicit media sentinel written during seed.

Health must never expose namespace IDs, Access secrets or tokens.

Update local tests and `scripts/smoke-cloudflare.mjs` accordingly.

## 11. WHATSAPP / PAYMENT RELEASE RULE

There is no payment gateway in V1. Do not add one.

The real Rebeca WhatsApp number is not yet canonical in the repository. Do not scrape or infer a production number from an unrelated directory listing and do not invent one.

Release mode may remain:

```text
demoMode=true
whatsappNumber=null
```

In that state:

- storefront is fully browseable
- cart/checkout calculations work
- UI clearly says proposal/demo
- final WhatsApp action must not silently send to a fake/test number
- show a clear configuration notice where appropriate
- local E2E continues to inject/intercept a test-only number and prove exact message generation

A real owner WhatsApp number is a content/config handoff, not a blocker to deploying this proposal release candidate.

When a verified owner number becomes available, adding it must require only an admin settings update; no redeploy.

## 12. CLOUDFLARE AUTH — MISSING GITLAB TOKEN IS NOT A BLOCKER

The previous GitLab runner lacked `CLOUDFLARE_API_TOKEN`.

ORDER-002 explicitly permits canonical release deployment from an authorized interactive operator environment.

Preferred path:

1. use an already-authenticated Wrangler profile if present
2. otherwise perform `wrangler login` interactively against the correct Cloudflare account
3. verify identity with `wrangler whoami`
4. if API calls beyond Wrangler are needed, `wrangler auth token --json` may be used in-memory

Security:

- never print the token into evidence
- never commit a token
- never paste OAuth/API credentials into source
- evidence may record only auth type/account identity and redacted command outcome
- GitLab CI Cloudflare variables may be added later; their absence does not stop ORDER-002 release

If an authorized Cloudflare login truly cannot be completed because the user/session/account is unavailable, that is the only acceptable authentication `BLOCKED_REAL`.

## 13. CLOUDFLARE ACCESS

Admin must not be public.

Configure Cloudflare Access for the canonical Workers URL so both are protected:

```text
/admin*
/api/admin*
```

Use a REBECA-specific Access application/path configuration.

Initial allowlist:

- the current GitLab project owner/admin identity is sufficient for the release candidate
- do not wait for the store owners' emails
- later owner emails can be added without code changes

Worker-side JWT verification remains defense in depth.

If Access creates more than one application/audience for the two protected path groups:

- change env/config from singular `CF_ACCESS_AUD` to a validated list `CF_ACCESS_AUDS`
- accept only audiences explicitly configured for REBECA
- never use wildcard audience acceptance

Required proof:

1. unauthenticated `/admin` is intercepted by Access/login or denied
2. unauthenticated `/api/admin/products` is not usable
3. authenticated owner session reaches admin
4. authenticated admin mutation reaches Worker and is reflected in the public catalog after KV propagation

Cloudflare Access official Worker/path protection may be configured through dashboard or API. Using the API is preferred if the authenticated environment can do it reproducibly.

## 14. DEPLOYMENT SEQUENCE — ONE CONTINUOUS RUN

ARQ must execute this sequence without returning to AUD between normal steps.

### A. Rebase and audit
- reconstruct remote state
- rebase feature onto latest main
- run contamination scan
- scan TODO/FIXME/not-implemented
- confirm no hidden payment integration or fake production WhatsApp number

### B. Persistence refactor
- add storage repository abstraction
- implement KV store repository
- convert catalog/import/settings/category paths to repository
- convert media service to MEDIA_KV
- remove release D1/R2 bindings/guards
- update health/smoke/types

### C. Local verification
Run fresh:

```text
typecheck
lint
format
unit
integration
build
secret scan
production dependency audit
Playwright E2E
Lighthouse
```

Update/add tests specifically for:

- StoreState Zod validation
- public filtering from KV state
- product create/update/status
- import dry-run no mutation
- duplicate import idempotency
- settings
- KV write-rate retry/error behavior
- media binary put/get/delete/reorder
- invalid media signature
- release health
- production auth boundary

Keep existing shopper/admin E2E behavior green.

### D. Cloudflare provisioning
From authenticated Wrangler session:

- create/bind exact REBECA STORE_KV
- create/bind exact REBECA MEDIA_KV
- do not delete or reuse anything else
- commit actual namespace IDs because KV namespace IDs are not secrets
- build release seed
- seed remote namespaces
- read back and validate exact REBECA state/media

### E. Access
- configure REBECA Access paths
- configure Worker Access validation vars
- verify unauthenticated denial/login
- verify authorized access

### F. Release deploy
Build from final feature HEAD.

Deploy `rebeca-sf` to:

```text
https://rebeca-sf.simondalmasso44.workers.dev/
```

Set:

```text
ENVIRONMENT=release
BUILD_SHA=<exact feature HEAD>
ADMIN_ORIGIN=https://rebeca-sf.simondalmasso44.workers.dev
PUBLIC_ORIGINS=https://rebeca-sf.simondalmasso44.workers.dev,https://rebeca-sf.web.app
```

Do not claim success until deployed `/api/health` returns the exact feature SHA.

### G. Remote smoke
Against the actual URL verify:

- `/` returns storefront HTML
- `/api/health` exact SHA and store/media ok
- `/api/catalog` has 14 published demo products
- a PDP deep link loads
- media returns correct content type
- cart/checkout runs in browser
- no fake WhatsApp launch when no production number configured
- `/admin` protected
- `/api/admin/*` protected

### H. Remote browser verification
Run release-URL browser verification, not only local CI.

Minimum:

- mobile 390x844: home -> catalog -> PDP -> variant -> cart -> checkout
- desktop 1440x900: same public path
- verify no console page errors
- verify no horizontal overflow
- capture screenshots
- authenticated admin: create or edit a demo product, publish/update, verify public API/storefront reflects it, then leave catalog in coherent demo state
- media upload to MEDIA_KV, public render, remove/reorder proof

A service token may be used for automated Access testing if convenient. It is not required if an authenticated browser session provides equivalent evidence.

### I. Pipeline
Push final branch.

The normal GitLab verification pipeline must pass on the final SHA.

Modify Cloudflare deploy jobs so:

- they may run if CI secrets are later configured
- they no longer require D1/R2
- their absence is not the canonical release blocker

The canonical release performed in this order may be interactive Wrangler, provided evidence binds it to the exact SHA.

### J. Evidence
Replace stale implementation-head text in `docs/evidence/ORDER-001/REPORT.md`.

Create:

```text
docs/evidence/ORDER-002/REPORT.md
```

This is the authoritative final release evidence.

## 15. CI / TEST ACCEPTANCE

Final branch must have all applicable gates green.

Minimum retained acceptance:

- Unit: all pass
- Integration: all pass
- E2E local: all pass
- axe: 0 critical / 0 serious on required surfaces
- Lighthouse:
  - Performance >= 90
  - Accessibility >= 95
  - Best Practices >= 95
  - SEO >= 90
  - CLS <= 0.1
  - LCP target <= 2.5s in meaningful local/mobile run
- secret scan clean
- no high/critical production vulnerability
- no committed credential/token
- build successful
- Wrangler dry-run successful

Do not lower thresholds just to release.

## 16. REMOTE ACCEPTANCE

ORDER-002 is complete only when all are true:

1. final feature SHA is known
2. MR !1 remains open and unmerged
3. final GitLab pipeline is green on that SHA
4. `STORE_KV` exists and is bound only to REBECA
5. `MEDIA_KV` exists and is bound only to REBECA
6. release state is seeded and valid
7. 14 demo products are publicly retrievable
8. demo provenance/demo notice remain honest
9. product media is served from MEDIA_KV
10. admin CRUD persists to STORE_KV
11. admin publication change appears publicly without a frontend rebuild
12. import dry-run/apply/idempotency remains correct
13. owner media upload/read/delete works remotely
14. Cloudflare Access protects admin UI and API
15. public storefront remains public
16. release URL is reachable
17. `/api/health.sha` equals exact final feature HEAD
18. public remote shopper walkthrough passes
19. no payment/card fields exist
20. absent real WhatsApp number does not trigger a fake/test destination in release
21. no unrelated Cloudflare resource was deleted/reused/mutated
22. no R2 subscription was activated
23. no D1 database was deleted or repurposed
24. evidence contains command/test/deploy/browser proof
25. MR remains Draft until AUD returns final verdict

## 17. FIREBASE MIRROR

Firebase is not a blocker.

Only after canonical Cloudflare release is green:

- if `rebeca-sf.web.app` can be refreshed trivially, update static mirror
- it may call the Cloudflare public API
- do not duplicate persistence/auth/admin backend into Firebase
- if Firebase credentials/config are unavailable, record `MIRROR=DEFERRED_NON_BLOCKING`

Do not spend the tranche troubleshooting Firebase while canonical Cloudflare is healthy.

## 18. FUTURE ERP COMPATIBILITY

The persistence pivot must not damage the ERP exoskeleton.

Keep:

- canonical product DTO
- canonical variant DTO
- import/export contract
- CatalogService
- source adapter seam
- external source/external ID fields

Future migration path:

```text
ERP adapter -> canonical DTO -> CatalogService -> StoreRepository
```

A later `D1StoreRepository`, external SQL repository or ERP-backed repository can replace `KvStoreRepository` without rewriting storefront/admin.

Document the release backend decision in:

```text
docs/architecture/storage-fast-path.md
```

Include the known KV tradeoff:

- read-heavy/small-catalog fit
- same-key write throttling
- eventual propagation characteristics
- single-owner admin assumption
- migration path for higher write concurrency

## 19. NO-CHURN RULE

Do not spend time on:

- redesigning passed storefront screens
- changing fonts/palette without a verified defect
- adding analytics
- adding PostHog
- adding payment
- adding user accounts
- adding email notifications
- adding discount engines
- adding shipping APIs
- introducing another CMS
- introducing Firebase backend
- chasing real Instagram catalog if authentication blocks it
- R2
- D1
- CI secret perfection before first canonical release

Only change existing product/UI code where required by the storage/deploy pivot or a newly reproduced defect.

## 20. ALLOWED BLOCKED_REAL

After ORDER-002, these are NOT valid blockers:

- R2 code 10042
- R2 checkout not activated
- D1 account database limit
- no dedicated D1 slot
- missing `CLOUDFLARE_API_TOKEN` in GitLab CI
- no Rebeca production WhatsApp number
- Firebase mirror unavailable

The only valid `BLOCKED_REAL` before canonical deploy is:

```text
CLOUDFLARE_AUTH_UNAVAILABLE
```

and only if ARQ proves that no authorized interactive Wrangler/dashboard/API session can authenticate to the correct account.

After auth succeeds, any KV/Worker/Access error must be debugged and resolved as implementation/infra work unless Cloudflare itself returns an externally non-actionable account/service restriction. Such a restriction requires exact error/code/evidence.

## 21. EVIDENCE REPORT

`docs/evidence/ORDER-002/REPORT.md` must contain:

- ORDER-002
- starting audited SHA
- final SHA
- rebase/base proof
- MR state
- final pipeline ID/status
- test counts
- Lighthouse/axe
- dependency/security results
- storage architecture diff summary
- exact REBECA KV binding names + namespace IDs
- seed counts
- media round-trip proof
- Access application/path proof
- unauthenticated admin denial
- authenticated admin mutation proof
- public catalog mutation reflection proof
- canonical URL
- health JSON with exact SHA
- remote public walkthrough
- screenshot artifact paths
- console/pageerror count
- catalog provenance counts
- WhatsApp release mode state
- confirmation no payment gateway
- confirmation R2 not activated
- confirmation no D1 deleted/reused
- confirmation no unrelated-project mutation
- Firebase mirror status
- known limitations that are genuinely non-blocking

Sanitize all credentials.

## 22. FINAL ARQ STATUS

ARQ must not stop at an intermediate “infra prepared” checkpoint.

Return control only after the full sequence above or a proven allowed BLOCKED_REAL.

Exact final shape:

```text
ORDER=ORDER-002
RESULT=READY_FOR_FINAL_AUDIT | BLOCKED_REAL
ARQ_DONE=YES | NO
BRANCH=feat/order-001-rebeca-v1
START_HEAD=ef0f8ee2834da81eecc428a1c1b5d6cf3e328417
HEAD=<final full sha>
MR=!1 / <url>
PIPELINE=<id/status>
RELEASE_CANDIDATE_URL=https://rebeca-sf.simondalmasso44.workers.dev/
HEALTH_SHA=<sha>
STORAGE=WORKERS_KV
STORE_KV=<binding/id>
MEDIA_KV=<binding/id>
CATALOG=<total/instagram/demo>
UNIT=<pass/fail>
INTEGRATION=<pass/fail>
E2E_LOCAL=<pass/fail>
E2E_REMOTE_PUBLIC=PASS|FAIL
ADMIN_REMOTE=PASS|FAIL
MEDIA_REMOTE=PASS|FAIL
ACCESS_PROTECTION=PASS|FAIL
IMPORT_IDEMPOTENCY=PASS|FAIL
WHATSAPP_LOGIC=PASS|FAIL
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
BLOCKER=<NONE or exact allowed blocker>
EVIDENCE=docs/evidence/ORDER-002/REPORT.md
```

## 23. DEFINITION OF DONE

For ORDER-002, DONE means:

A public, usable REBECA proposal storefront is actually deployed on the canonical Cloudflare Workers URL; the exact source SHA is verifiable; the demo catalog/media are real runtime data; cart/checkout logic works without a payment gateway; admin is protected by Cloudflare Access and can persist catalog/media changes using REBECA-only Workers KV; all fresh local and remote release gates pass; evidence is committed; MR !1 remains unmerged and ready for one final independent AUD verdict.

No R2.
No D1 dependency.
No fake WhatsApp number.
No unrelated-project mutation.
No further architectural tranche after this one unless final audit reproduces a concrete defect.
