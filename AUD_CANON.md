# AUD_CANON

## PROJECT / PURPOSE / REPO / LIVE
- PROJECT: REBECA-SF
- PURPOSE: mobile-first visual ecommerce proposal for Rebeca Santa Fe; catalog/PDP/cart/admin; checkout ends in WhatsApp only; no payment gateway/card collection.
- CANONICAL REPO: https://github.com/simondalmasso/rebeca
- LEGACY SOURCE: https://gitlab.com/simondalmasso/rebeca-sf
- LIVE TARGET: https://rebeca-sf.simondalmasso44.workers.dev/
- FIREBASE MIRROR TARGET: https://rebeca-sf.web.app/
- LIVE STATUS: release completion is NOT verified; no exact-SHA health/deploy evidence is committed.

## LAST_VERIFIED / BRANCH / HEAD
- LAST_VERIFIED: 2026-09-25
- CANONICAL BRANCH: `main`
- CODE_SNAPSHOT_HEAD: `5155884821f5159803dd24d90dc8194de0296021` (GitHub migration snapshot; canon-doc commit follows this code snapshot)
- SOURCE_SNAPSHOT: GitLab `feat/order-001-rebeca-v1@54085cb39b7f95940f39782a460d58526ef5952d`
- SOURCE CI: GitLab pipeline `2861850173 / #39 / SUCCESS`
- MIGRATION PROOF: GitHub tree contains 105/105 source blobs with exact Git blob SHA match.

## CANONICAL LINKS
- Repo: https://github.com/simondalmasso/rebeca
- Active order: https://github.com/simondalmasso/rebeca/blob/main/docs/orders/ORDER-002.md
- Governance: https://github.com/simondalmasso/rebeca/blob/main/docs/aud/GOVERNANCE.md
- Legacy MR (read-only historical source): https://gitlab.com/simondalmasso/rebeca-sf/-/merge_requests/1
- Legacy green pipeline: https://gitlab.com/simondalmasso/rebeca-sf/-/pipelines/2861850173

## CURRENT STATE
- GitHub is now canonical; the active GitLab feature snapshot was migrated byte-for-byte.
- Runtime architecture is Workers Static Assets + Hono + Workers KV; D1/R2 release bindings are gone.
- `wrangler.toml` contains REBECA-only KV bindings:
  - `STORE_KV=616f4a65e5ab4629a8bb281ecc18a22c`
  - `MEDIA_KV=a83b4db8a6ad4b3e91dbe900db088cdc`
- `scripts/build-kv-release-seed.mjs` is committed and builds deterministic 14-product / 14-media demo seed with `whatsappNumber=null`.
- Prior ARQ reported remote KV provisioning + seed/readback PASS; that runtime proof is not yet consolidated in `docs/evidence/ORDER-002/REPORT.md`.
- Cloudflare Access is still unproven: no committed/verified `CF_ACCESS_TEAM_DOMAIN` or `CF_ACCESS_AUDS`, and no anonymous/authenticated path evidence.
- Canonical Worker deploy, exact `/api/health.sha`, remote admin/media/import/browser acceptance, and Firebase mirror remain unverified.
- GitHub Actions is not configured; the last deterministic CI evidence is the legacy GitLab #39 run on the identical code snapshot.

## DONE
- Storefront/admin implementation and KV persistence pivot.
- D1/R2 runtime/test removal.
- 14 demo products + 14 committed WebP demo assets + provenance.
- KV namespace IDs persisted in config.
- Last source CI gates green: quality, unit, integration, build, security, E2E, Lighthouse.
- Migration from private GitLab working snapshot to GitHub completed with exact 105-blob equality.

## ACTIVE WORK
Finish ORDER-002 from Cloudflare Access onward on GitHub, then deploy and produce final remote evidence.

## PENDING
- Create a GitHub working branch/PR from current `main`; do not edit legacy GitLab further.
- Configure Access only for `/admin`, `/admin/*`, `/api/admin`, `/api/admin/*`; storefront/public API stay public.
- Fresh verification after any post-migration changes.
- Deploy exact GitHub working HEAD to `rebeca-sf`.
- Verify health SHA, 14-product catalog/media, public shopper flow, authenticated admin mutation, media round-trip, import idempotency, axe/Lighthouse/screenshots.
- Create `docs/evidence/ORDER-002/REPORT.md`.
- Firebase mirror is non-blocking and comes after Cloudflare canonical release.

## BLOCKERS / RISKS
- No external blocker is currently verified.
- Access configuration/authorization is the unresolved infra step.
- GitHub repo is public whereas legacy GitLab source was private; secret scan was green on the identical code snapshot, but never commit credentials/tokens.
- No GitHub CI exists yet; do not mislabel legacy GitLab CI as GitHub CI.

## DO_NOT_TOUCH
- No ZUNGUN/SENEX/VOY/SOS/ATM/MONEYKILLER or other project resources.
- No D1 deletion/reuse; no R2 activation.
- No payment gateway.
- No invented production WhatsApp number.
- No direct destructive Cloudflare cleanup.
- Do not merge release work before final AUD verdict.

## AUTHORITIES / GATES
- ORDER-002 remains release/product authority except repository-location/CI references are superseded by this GitHub migration.
- GitHub `main` is canonical source; legacy GitLab MR/pipeline are evidence only.
- VERIFY>ASSUME, EVIDENCE>CLAIM, exact deployed SHA required.
- Release gate: Access protected correctly + fresh tests + deployed `/api/health.sha == working HEAD` + remote public/admin/media/import acceptance + evidence report.

## NEXT EXACT ACTION
Open ARQ from `ARQ_CANON.md`; create a GitHub feature branch from current `main` and resume at Cloudflare Access configuration, then execute continuously through exact-SHA deploy and final evidence.