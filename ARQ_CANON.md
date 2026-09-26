# ARQ_CANON

## PROJECT / PURPOSE / REPO / LIVE
- PROJECT: REBECA-SF
- PURPOSE: finish and deploy the existing ecommerce proposal; visual storefront + catalog/PDP/cart/admin; checkout is WhatsApp handoff only; no payment gateway.
- CANONICAL REPO: https://github.com/simondalmasso/rebeca
- LEGACY SOURCE: https://gitlab.com/simondalmasso/rebeca-sf (read-only historical source)
- LIVE TARGET: https://rebeca-sf.simondalmasso44.workers.dev/
- FIREBASE MIRROR: https://rebeca-sf.web.app/ (non-blocking, after Cloudflare)

## LAST_VERIFIED / BRANCH / HEAD
- LAST_VERIFIED: 2026-09-25
- START BRANCH: GitHub `main`
- CODE_SNAPSHOT_HEAD: `5155884821f5159803dd24d90dc8194de0296021`
- MIGRATED FROM: GitLab `feat/order-001-rebeca-v1@54085cb39b7f95940f39782a460d58526ef5952d`
- SOURCE PIPELINE: `2861850173 / #39 / SUCCESS`
- MIGRATION: 105/105 blobs exact SHA match.

## CANONICAL LINKS
- Repo: https://github.com/simondalmasso/rebeca
- ORDER-002: https://github.com/simondalmasso/rebeca/blob/main/docs/orders/ORDER-002.md
- Governance: https://github.com/simondalmasso/rebeca/blob/main/docs/aud/GOVERNANCE.md
- AUD canon: https://github.com/simondalmasso/rebeca/blob/main/AUD_CANON.md
- Legacy MR !1: https://gitlab.com/simondalmasso/rebeca-sf/-/merge_requests/1
- Legacy pipeline #39: https://gitlab.com/simondalmasso/rebeca-sf/-/pipelines/2861850173

## CURRENT STATE
- Work from GitHub only.
- KV runtime is implemented; no D1/R2 release dependency.
- `wrangler.toml` already binds:
  - `STORE_KV=616f4a65e5ab4629a8bb281ecc18a22c`
  - `MEDIA_KV=a83b4db8a6ad4b3e91dbe900db088cdc`
- Deterministic seed script is committed; intended seed = 14 demo products + 14 demo WebP assets + `whatsappNumber=null`.
- Prior ARQ reported KV remote seed/readback PASS, but final ORDER-002 evidence is missing.
- Access, canonical deploy and remote acceptance are not complete/verified.
- No GitHub Actions workflow exists; GitLab #39 is historical evidence for the identical migrated code snapshot.

## DONE
- Storefront/admin/cart/PDP/checkout logic.
- KV repository/media implementation.
- D1/R2 cleanup.
- Local/source CI gates green on migrated code.
- Demo catalog/media/provenance.
- REBECA KV IDs persisted.
- Exact code migration to GitHub.

## ACTIVE WORK
Cloudflare Access -> fresh verification -> exact-SHA canonical deploy -> remote acceptance -> ORDER-002 report -> final AUD.

## PENDING
- Access path protection and real audience/team-domain evidence.
- Fresh tests after post-migration edits.
- Exact-SHA deploy and health.
- Remote shopper/admin/media/import verification.
- Final evidence report.
- Optional Firebase static mirror after canonical Cloudflare PASS.

## BLOCKERS / RISKS
- BLOCKED_REAL=NO at canon time.
- If Access cannot be configured, preserve exact provider error/permission evidence; do not invent a blocker.
- Public GitHub repo: never commit auth tokens, Access secrets, cookies or OAuth material.

## DO_NOT_TOUCH
- Other projects/resources.
- D1/R2.
- Payment gateway.
- Fake WhatsApp destination.
- Unrelated redesign/refactor.
- Legacy GitLab branch except read-only evidence.
- GitHub `main` directly after work starts; use a feature branch/PR.

## AUTHORITIES / GATES
- ORDER-002 controls product/release behavior; this canon supersedes its old GitLab repository-location assumptions.
- No final merge before AUD.
- Exact runtime SHA and remote behavior are mandatory; CI/local green alone is not release proof.

## WHERE_TO_RESUME
Resume at ORDER-002 Access step. The previous exact source work stopped after KV provisioning/seed; do NOT redo the KV pivot or recreate namespaces.

## WHAT_TO_DO_NOW
1. Fetch GitHub `main`; verify code snapshot ancestry and clean working tree.
2. Create branch `feat/order-002-finalize-deploy` from current GitHub `main`; open a Draft PR to `main`.
3. Reconfirm `STORE_KV` and `MEDIA_KV` bindings; do not recreate them.
4. Configure one REBECA Access application protecting exactly:
   - `/admin`
   - `/admin/*`
   - `/api/admin`
   - `/api/admin/*`
   Public storefront/API/media must remain public.
5. Capture real `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUDS` without committing secrets.
6. Verify anonymous deny/login + authenticated admin access.
7. Run fresh typecheck/lint/format/unit/integration/build/secret/prod-audit/E2E/Lighthouse after any code/config changes.
8. Deploy the exact branch HEAD to `rebeca-sf` with Wrangler OAuth; set `BUILD_SHA=<exact HEAD>`.
9. Verify remotely: `/`, `/api/health`, `/api/catalog`, PDP/media/cart/checkout, 14 products, no fake WhatsApp.
10. Verify authenticated admin mutation -> public reflection, media upload/read/reorder/delete, import preview/apply/idempotency.
11. Capture responsive/browser/axe/Lighthouse evidence and create `docs/evidence/ORDER-002/REPORT.md`.
12. Push final evidence; if HEAD changes, redeploy that exact final HEAD and prove `/api/health.sha == HEAD`.
13. Return `READY_FOR_FINAL_AUDIT`; do not merge.

## WHAT_NOT_TO_REPEAT
- Do not redo architecture, KV pivot, demo catalog/media generation, D1/R2 cleanup or GitLab migration.
- Do not recreate `rebeca-sf-store` or `rebeca-sf-media`.
- Do not investigate other Cloudflare projects to solve REBECA.
- Do not treat missing Firebase mirror or missing GitHub CI as an automatic release blocker.
- Do not return merely because a tool window ends: commit/push a durable checkpoint first.

## ACCEPTANCE / STOP CONDITIONS
ACCEPT only when:
- Draft GitHub PR remains unmerged.
- Fresh gates pass for final code/config.
- Access protects admin UI/API only; public storefront remains public.
- Canonical Worker is reachable and `/api/health.sha` equals final GitHub HEAD.
- 14 demo products/media render remotely.
- public shopper flow PASS.
- authenticated admin CRUD + media + import idempotency PASS remotely.
- payment gateway ABSENT; production WhatsApp remains explicitly unconfigured/demo unless a verified owner number is supplied.
- `docs/evidence/ORDER-002/REPORT.md` is committed.
- no unrelated-project/D1/R2 mutation occurred.

STOP only for a demonstrated external provider/auth restriction that prevents the next required action after safe troubleshooting; record exact error/evidence and preserve all completed work remotely.