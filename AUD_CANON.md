# AUD_CANON

## PROJECT / PURPOSE / REPO / LIVE
- PROJECT: REBECA-SF
- PURPOSE: finish and release the Rebeca Santa Fe fashion storefront/admin proposal; checkout is WhatsApp handoff only, no payment gateway.
- CANONICAL REPO: https://github.com/simondalmasso/rebeca
- DOWNSTREAM MIRROR: https://gitlab.com/simondalmasso/rebeca-sf
- LIVE TARGET: https://rebeca-sf.simondalmasso44.workers.dev/
- ACTIVE AUTHORITY: https://github.com/simondalmasso/rebeca/blob/main/docs/orders/ORDER-003.md

## LAST_VERIFIED / BRANCH / HEAD
- LAST_VERIFIED: 2026-09-26
- CANONICAL BRANCH: main
- ORDER-003 issued from: `3f984da1b7427cc20dfa2083f9b6b1de26a1669a`
- GitHub->GitLab mirror architecture is server-side, but latest run `36266321977` failed because `GITLAB_MIRROR_TOKEN` is expired/invalid. Rotate the GitHub Actions secret with a durable GitLab repository-write credential; do not fall back to a host/local mirror.
- Legacy implementation source pipeline: GitLab #39 SUCCESS on migrated code snapshot.

## CURRENT STATE
- GitHub is sole source of truth; GitLab is downstream mirror only.
- Existing stack: React/Vite + Hono Worker + Workers KV.
- STORE_KV=`616f4a65e5ab4629a8bb281ecc18a22c`
- MEDIA_KV=`a83b4db8a6ad4b3e91dbe900db088cdc`
- deterministic 14-product/14-media demo seed is committed.
- Runtime release is not yet accepted: Access, definitive exact-SHA deploy, remote admin/media/import acceptance and final evidence remain.
- ORDER-003 authorizes one bounded visual pass: REBECA_EDITORIAL_COMMERCE. It explicitly forbids replatforming.

## DONE
- storefront/admin/cart/PDP/checkout implementation
- KV persistence pivot; no release D1/R2 dependency
- demo catalog/media/provenance
- exact migration to GitHub
- server-side GitHub->GitLab mirror architecture (credential rotation now required)
- research shortlist for fashion UX/code patterns

## ACTIVE WORK
ORDER-003 final product + release closure; first repair server-side mirror credential, then continue.

## PENDING
- branch `feat/order-003-final-close` + Draft GitHub PR
- bounded UX/design refinement
- fresh GitHub CI
- Cloudflare Access for admin UI/API only
- exact-SHA canonical deploy
- remote shopper/admin/media/import/axe/Lighthouse acceptance
- `docs/evidence/ORDER-003/REPORT.md`
- final independent AUD

## BLOCKERS/RISKS
- BLOCKED_REAL currently unproven.
- no production WhatsApp number is not a release blocker; keep unconfigured demo behavior honest.
- design tooling outage is not a release blocker.
- never commit credentials.

## DO_NOT_TOUCH
- unrelated project infrastructure
- D1/R2
- payments
- direct GitLab development
- local/host mirror mechanisms
- framework/backend replatforming
- merge before final AUD

## AUTHORITIES/GATES
- ORDER-003 is current closure authority.
- VERIFY>ASSUME; EVIDENCE>CLAIM.
- final deployed health SHA must equal definitive GitHub HEAD after evidence commit.
- final GitHub CI green + remote acceptance + Access proof required.
- Draft PR stays unmerged until AUD PASS.

## NEXT EXACT ACTION
Open ARQ from ARQ_CANON.md; first repair `GITLAB_MIRROR_TOKEN` and prove GitHub/GitLab SHA equality, then execute ORDER-003 continuously to READY_FOR_FINAL_AUDIT.