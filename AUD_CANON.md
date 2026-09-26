# AUD_CANON

## PROJECT / PURPOSE / REPO / LIVE
- PROJECT: REBECA-SF
- PURPOSE: mobile-first visual ecommerce proposal for Rebeca Santa Fe; catalog/PDP/cart/admin; checkout ends in WhatsApp only; no payment gateway/card collection.
- CANONICAL REPO: https://github.com/simondalmasso/rebeca
- DOWNSTREAM MIRROR: https://gitlab.com/simondalmasso/rebeca-sf
- LIVE TARGET: https://rebeca-sf.simondalmasso44.workers.dev/
- FIREBASE MIRROR TARGET: https://rebeca-sf.web.app/
- LIVE STATUS: release completion is NOT verified; no exact-SHA health/deploy evidence is committed.

## LAST_VERIFIED / BRANCH / HEAD
- LAST_VERIFIED: 2026-09-25
- CANONICAL BRANCH: `main`
- CODE_SNAPSHOT_HEAD: `5155884821f5159803dd24d90dc8194de0296021`
- SOURCE_SNAPSHOT: GitLab `feat/order-001-rebeca-v1@54085cb39b7f95940f39782a460d58526ef5952d`
- SOURCE CI: GitLab pipeline `2861850173 / #39 / SUCCESS`
- MIGRATION PROOF: GitHub tree matched the 105/105 source blobs by Git blob SHA.
- MIRROR PROOF: GitHub Actions run `36211545381` completed SUCCESS and synchronized GitHub/GitLab `main` at `250d004d8739c86f6c3f512fd0908ec9ac675f05`.

## CANONICAL LINKS
- Repo: https://github.com/simondalmasso/rebeca
- Server-side mirror workflow: https://github.com/simondalmasso/rebeca/blob/main/.github/workflows/mirror-gitlab.yml
- Active order: https://github.com/simondalmasso/rebeca/blob/main/docs/orders/ORDER-002.md
- Governance: https://github.com/simondalmasso/rebeca/blob/main/docs/aud/GOVERNANCE.md
- GitLab mirror: https://gitlab.com/simondalmasso/rebeca-sf
- Legacy MR: https://gitlab.com/simondalmasso/rebeca-sf/-/merge_requests/1
- Legacy green pipeline: https://gitlab.com/simondalmasso/rebeca-sf/-/pipelines/2861850173

## CURRENT STATE
- GitHub is the sole source of truth.
- GitLab is an automatic server-side downstream mirror driven by GitHub Actions `.github/workflows/mirror-gitlab.yml`.
- Mirror trigger: every GitHub push to any branch/tag plus manual `workflow_dispatch`.
- GitHub Actions secret `GITLAB_MIRROR_TOKEN` is installed; mirror does not depend on DESKTOP-DPH3941, Remote Desktop Commander, SentinelX, or any local scheduled task.
- GitLab-only historical refs are preserved; normal development must occur only in GitHub.
- Runtime architecture is Workers Static Assets + Hono + Workers KV; D1/R2 release bindings are gone.
- `wrangler.toml` contains REBECA-only KV bindings:
  - `STORE_KV=616f4a65e5ab4629a8bb281ecc18a22c`
  - `MEDIA_KV=a83b4db8a6ad4b3e91dbe900db088cdc`
- `scripts/build-kv-release-seed.mjs` is committed and builds deterministic 14-product / 14-media demo seed with `whatsappNumber=null`.
- Prior ARQ reported remote KV provisioning + seed/readback PASS; final `docs/evidence/ORDER-002/REPORT.md` is still missing.
- Cloudflare Access, canonical exact-SHA deploy, remote admin/media/import/browser acceptance, and Firebase mirror remain unverified.

## DONE
- Storefront/admin implementation and KV persistence pivot.
- D1/R2 runtime/test removal.
- 14 demo products + 14 committed WebP demo assets + provenance.
- KV namespace IDs persisted.
- Last source CI gates green: quality, unit, integration, build, security, E2E, Lighthouse.
- Exact code migration from GitLab working snapshot to GitHub.
- Server-side GitHub -> GitLab mirror configured and proven with a successful GitHub Actions run.

## ACTIVE WORK
Finish ORDER-002 from Cloudflare Access onward on GitHub, then deploy and produce final remote evidence.

## PENDING
- Create GitHub working branch/PR from current `main`; do not develop in GitLab.
- Configure Access only for `/admin`, `/admin/*`, `/api/admin`, `/api/admin/*`; storefront/public API stay public.
- Fresh verification after post-migration changes.
- Deploy exact GitHub working HEAD to `rebeca-sf`.
- Verify health SHA, 14-product catalog/media, public shopper flow, authenticated admin mutation, media round-trip, import idempotency, axe/Lighthouse/screenshots.
- Create `docs/evidence/ORDER-002/REPORT.md`.
- Firebase mirror is non-blocking and comes after Cloudflare canonical release.

## BLOCKERS / RISKS
- No external blocker is currently verified.
- Access configuration/authorization is the unresolved infra step.
- GitHub repo is public; never commit credentials/tokens.
- `GITLAB_MIRROR_TOKEN` is a GitHub Actions repository secret; rotate/revoke it if GitLab credentials are rotated.

## DO_NOT_TOUCH
- No ZUNGUN/SENEX/VOY/SOS/ATM/MONEYKILLER or other project resources.
- No D1 deletion/reuse; no R2 activation.
- No payment gateway.
- No invented production WhatsApp number.
- Do not develop directly in GitLab.
- Do not add a local/host mirror dependency.
- Do not merge release work before final AUD verdict.

## AUTHORITIES / GATES
- ORDER-002 remains release/product authority except repository-location/CI assumptions superseded by GitHub canon.
- GitHub `main` is canonical source; GitLab is downstream mirror plus historical evidence.
- VERIFY>ASSUME, EVIDENCE>CLAIM, exact deployed SHA required.
- Mirror gate: GitHub Actions mirror job SUCCESS and GitLab target SHA equals GitHub source SHA.
- Release gate: Access protected correctly + fresh tests + deployed `/api/health.sha == working HEAD` + remote public/admin/media/import acceptance + evidence report.

## NEXT EXACT ACTION
Open ARQ from `ARQ_CANON.md`; create a GitHub feature branch from current `main` and resume at Cloudflare Access configuration, then execute continuously through exact-SHA deploy and final evidence.