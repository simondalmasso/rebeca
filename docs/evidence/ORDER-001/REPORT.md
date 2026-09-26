# ORDER-001 — Final ARQ evidence report

Capture: 2026-09-17

Repository: `simondalmasso/rebeca-sf`

Branch: `feat/order-001-rebeca-v1`

Draft MR: `!1` — https://gitlab.com/simondalmasso/rebeca-sf/-/merge_requests/1

Verified implementation HEAD: `21b8bd9661edfb06eb799bf87b323c34a3055793`

Fresh implementation verification pipeline: `2859427297` / IID `29`

Pipeline result: `success` with warning only because the optional read-only Cloudflare probe failed on missing CI authentication.

This report records the final ARQ checkpoint possible without crossing the external infrastructure gates below. It does not claim a deployed release candidate.

## 1. Repository and MR state

- Feature branch is the ORDER-001 implementation branch.
- Draft MR `!1` targets `main` and remains unmerged.
- At report publication the MR is OPEN/DRAFT, `has_conflicts=false`, `diverged_commits_count=0`.
- No production mutation or merge was performed.
- Project-purity scans on the feature branch returned no matches for the unrelated-project identifiers that had contaminated the earlier pre-release note.

## 2. Fresh pipeline evidence

Pipeline `2859427297` exercised implementation HEAD `21b8bd9661edfb06eb799bf87b323c34a3055793`.

| Gate | Job | Result | Evidence |
|---|---:|---|---|
| quality | `16574027061` | PASS | typecheck + lint + format check |
| unit | `16574027062` | PASS | 4 files, 8 tests |
| integration | `16574027063` | PASS | 3 files, 11 tests |
| build | `16574027064` | PASS | Vite production build + Wrangler dry-run |
| security | `16574027065` | PASS | `SECRET_SCAN=CLEAN`; production dependency audit: 0 vulnerabilities |
| browser E2E | `16574027066` | PASS | 6/6 Playwright tests, no retry required |
| Lighthouse | `16574027067` | PASS | median of 3 local CI runs meets ORDER-001 thresholds |
| Cloudflare probe | `16574027068` | BLOCKED | read-only probe could not authenticate because CI lacks `CLOUDFLARE_API_TOKEN` |

Fresh counts:

- Unit: `8 passed / 0 failed`.
- Integration: `11 passed / 0 failed`.
- Browser E2E: `6 passed / 0 failed`.

The successful fresh implementation pipeline ran:

```text
npm run typecheck
npm run lint
npm run format:check
npm run test:unit
npm run test:integration
npm run build
npm run secret:scan
npm run audit:prod
npm run e2e
```

The Lighthouse job additionally started the local Worker/app, seeded the 14-item demo catalog, ran Lighthouse 13.4.1 three times and applied median thresholds through `scripts/assert-lighthouse.mjs`.

The optional read-only Cloudflare probe ran:

```text
npx wrangler@4.133.0 whoami
npx wrangler@4.133.0 d1 list --json
npx wrangler@4.133.0 r2 bucket list
```

`wrangler whoami` returned `You are not authenticated`. The D1 command then stopped with the explicit non-interactive requirement for `CLOUDFLARE_API_TOKEN`. No mutation was attempted.

## 3. Unit, integration and D1 evidence

Fresh unit job `16574027062` passed 4 files / 8 tests covering money/order formatting, cart behavior, variant/storage behavior and catalog/shared contract logic.

Fresh integration job `16574027063` passed:

- `catalog-service.test.ts`: 5 tests.
- `media-service.test.ts`: 2 tests.
- `api-security.test.ts`: 4 tests.
- Total: 11 tests.

The integration fixture initializes an empty SQLite/D1-compatible test database from `worker/db/migrations/0001_init.sql`, exercising the current initial migration before service/API behavior.

`catalog-service.test.ts` verifies the canonical catalog path, public publication behavior, import dry-run semantics and repeated-import idempotency. Repeated apply does not duplicate the product.

`api-security.test.ts` verifies:

- missing admin identity -> `401`;
- invalid mutation Origin -> `403`;
- test-only admin header cannot authenticate in `production` -> `401`;
- health includes build SHA and DB state.

These are local production-mode boundary tests, not a substitute for real Cloudflare Access on the release URL.

## 4. Browser E2E and WhatsApp evidence

Fresh E2E job `16574027066` ran 6 tests using one Chromium worker; all 6 passed without retry.

Covered workflows:

1. Admin creates a product with fixture media and variant, publishes it, the public storefront sees it, admin edits title/price, and public API/PDP reflect the update without a frontend rebuild.
2. Admin JSON export exists; JSON import dry-run succeeds; admin editor has zero serious/critical axe violations.
3. Buyer flow: home -> tienda -> PDP -> required size/color -> add -> cart -> reload -> checkout -> name/delivery -> deterministic WhatsApp handoff assertion.
4. Core public routes have zero serious/critical axe violations.
5. 320 px storefront has no horizontal overflow and mobile filters reset.
6. Required responsive release screenshots are captured for all five mandated viewports.

The buyer E2E asserts a test-only destination URL of the form `https://wa.me/5493420000000?text=...`, canonical greeting, `RB-YYYYMMDD-XXXXX` order code, customer name, delivery choice, `M / Negro` variant, quantity and total. No real WhatsApp message is sent.

## 5. Responsive screenshot evidence

E2E job `16574027066` uploads `playwright-report/` and `test-results/` artifacts. The evidence test captures:

- `320x720`
- `360x800`
- `390x844`
- `768x1024`
- `1440x900`

For each viewport:

- `*-home-first.png`
- `*-home-full.png`
- `*-catalog.png`
- `*-pdp-selected.png`
- `*-cart.png`
- `*-checkout.png`
- `*-admin-editor.png`

The successful job reported 39 matching files/directories under `test-results/` and uploaded the artifact archive.

## 6. Accessibility evidence

Fresh browser suite:

- Core public routes: `0 critical / 0 serious` axe violations.
- Admin product editor: `0 critical / 0 serious` axe violations.

A previously masked admin contrast defect was reproduced deterministically, corrected from `#737373` to `#6b6b6b`, and the fresh E2E run passed without retry.

## 7. Lighthouse and bundle evidence

Fresh Lighthouse job `16574027067`, median of three local CI runs:

```text
Performance: 98
Accessibility: 100
Best Practices: 100
SEO: 91
LCP: 1742 ms
CLS: 0.077
LIGHTHOUSE_GATE=PASS
```

This is local CI evidence, not a measurement of the blocked canonical Cloudflare release URL.

Fresh build job `16574027064`:

- public JS: `256.62 kB` raw / `81.61 kB gzip`;
- admin JS chunk: `29.91 kB` raw / `8.11 kB gzip`;
- public CSS: `14.14 kB` raw / `4.01 kB gzip`;
- Wrangler dry-run Worker upload: `789.54 KiB` / `137.14 KiB gzip`.

The public initial JS gzip is below the ORDER-001 ~180 kB target and admin remains a separate chunk.

## 8. Security evidence

Fresh security job `16574027065`:

```text
SECRET_SCAN=CLEAN
found 0 vulnerabilities
```

The vulnerability result is from `npm audit --omit=dev --audit-level=high`, the production dependency gate required by ORDER-001. No secret was added and no local Wrangler OAuth credential was copied into GitLab CI.

## 9. Catalog provenance

`data/catalog-source-manifest.json` contains 14 illustrative catalog items/media records:

```text
total=14
instagram_public=0
demo_generated=14
```

All fourteen remain `demo_generated`. Names, prices and variants are illustrative proposal data, not confirmed Rebeca inventory. R2 keys remain null until the real R2 upload path is exercised. The proposal/demo notice remains required.

## 10. R2 blocker

Local integration tests exercise media behavior through the R2 service boundary represented by the test bucket. This is not a real Cloudflare R2 round-trip.

The project-pure pre-release checkpoint records the prior read-only Cloudflare result:

```text
Cloudflare code 10042
Please enable R2 through the Cloudflare Dashboard
```

Therefore real `rebeca-sf-media` create/upload/download/delete has not been exercised, `R2_MEDIA` cannot be PASS, and no alternate storage was substituted. This remains `BLOCKED_REAL_R2_SUBSCRIPTION` until the account owner activates R2.

## 11. D1 blocker

The project-pure pre-release checkpoint records that the Cloudflare account was at its D1 database-count limit. No existing database was deleted, repurposed or modified for REBECA.

`wrangler.toml` keeps the dedicated REBECA D1 UUID as a placeholder, and CI refuses a release deploy while it remains. A dedicated `rebeca-sf` D1 slot/database is required before canonical release.

## 12. Cloudflare CI and Access blocker

Fresh read-only CI probe `16574027068` proves the GitLab runner lacks the required Cloudflare authentication:

```text
You are not authenticated. Please run `wrangler login`.
In a non-interactive environment, it's necessary to set a CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
```

The release job also requires `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD`, derived from the real owner/admin Access setup. That real release Access setup has not been exercised.

Accordingly:

- local production-mode auth boundary tests PASS;
- real Cloudflare Access protection is not release-verified;
- `deploy_cloudflare` was not played;
- `smoke_cloudflare` did not run;
- no production mutation occurred.

## 13. Release URL and health SHA

Canonical target:

`https://rebeca-sf.simondalmasso44.workers.dev/`

This report does not claim that implementation HEAD `21b8bd9661edfb06eb799bf87b323c34a3055793` is deployed there. Required D1/R2/credential/Access gates remain unresolved, so there is no valid deployed `/api/health` response proving the branch SHA.

```text
RELEASE_CANDIDATE_URL=TARGET_NOT_VERIFIED
HEALTH_SHA=UNAVAILABLE
```

Firebase `https://rebeca-sf.web.app/` remains a static-mirror target only and is deferred until canonical Cloudflare release is healthy.

## 14. Intentional non-actions

- no merge to `main`;
- no canonical release deploy;
- no production mutation;
- no deletion/reuse of another D1 database;
- no storage substitution for blocked R2;
- no fake Access PASS;
- no fake health-SHA PASS;
- no Firebase dynamic backend or duplicate catalog;
- no real WhatsApp message sent;
- no claim that demo garments are real inventory.

## 15. Final ARQ checkpoint

```text
ORDER=ORDER-001
RESULT=BLOCKED_REAL
ARQ_DONE=NO
BRANCH=feat/order-001-rebeca-v1
HEAD=21b8bd9661edfb06eb799bf87b323c34a3055793 (verified implementation HEAD; REPORT.md commits are documentation-only successors)
MR=!1 / https://gitlab.com/simondalmasso/rebeca-sf/-/merge_requests/1
PIPELINE=2859427297 / SUCCESS_WITH_WARNING_OPTIONAL_INFRA_PROBE
RELEASE_CANDIDATE_URL=https://rebeca-sf.simondalmasso44.workers.dev/ (TARGET_NOT_VERIFIED)
HEALTH_SHA=UNAVAILABLE
UNIT=8 passed / 0 failed
INTEGRATION=11 passed / 0 failed
E2E=6 passed / 0 failed
AXE=0 critical / 0 serious on exercised core public routes and admin editor
LIGHTHOUSE=P98/A100/BP100/SEO91 + LCP=1742ms + CLS=0.077 (local CI)
CATALOG=14/0/14
ADMIN_E2E=PASS
WHATSAPP_E2E=PASS
IMPORT_IDEMPOTENCY=PASS
R2_MEDIA=BLOCKED_REAL
ACCESS_PROTECTION=LOCAL_BOUNDARY_PASS / REAL_RELEASE_UNVERIFIED
SECRET_SCAN=PASS
PRODUCTION_MUTATION=NO
BLOCKER=R2 activation code 10042; dedicated D1 slot unavailable; GitLab runner lacks CLOUDFLARE_API_TOKEN; real Cloudflare Access owner configuration still required
EVIDENCE=docs/evidence/ORDER-001/REPORT.md
```

ARQ stops implementation churn at this checkpoint. Remaining work is externally gated release infrastructure, followed by canonical deploy, real R2/Access validation, deployed smoke/health SHA, and only then an AUD-ready `ARQ_DONE=YES` checkpoint.
