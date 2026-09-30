# ORDER-003 — CURRENT RELEASE EVIDENCE

STATUS: RELEASE_CANDIDATE_WITH_EXTERNAL_FIREBASE_AND_MIRROR_GATES
DATE: 2026-09-30
PROJECT: REBECA-SF
CANON: https://github.com/simondalmasso/rebeca
BRANCH: feat/order-003-final-close
PR: https://github.com/simondalmasso/rebeca/pull/1 (Draft, unmerged)
RELEASE_URL: https://rebeca-sf.simondalmasso44.workers.dev/
PRE_COMMIT_HEAD: 8d9a1437852ad0f3a8efd3f792b4e7e1f4776bf1

## Architecture and product direction
- Mobile-first REBECA editorial commerce direction remains in place.
- Backend remains Cloudflare Worker + KV.
- STORE_KV: 616f4a65e5ab4629a8bb281ecc18a22c.
- MEDIA_KV: a83b4db8a6ad4b3e91dbe900db088cdc.
- Worker-native Basic Auth remains the admin protection.
- Cloudflare Zero Trust remains intentionally unused.
- No payment gateway, D1 migration, R2 dependency, or replatform was introduced.
- npm run build now pins --config wrangler.toml so a host-global Wrangler configuration cannot alter REBECA dry-run bindings.

## Live runtime verified on 2026-09-30
- /api/health: HTTP 200.
- health.sha: 8d9a1437852ad0f3a8efd3f792b4e7e1f4776bf1.
- environment=release; storage=kv; store=ok; media=ok.
- /api/catalog: HTTP 200, 25 products.
- Existing 23 products were preserved.
- No catalog deletion was performed.

## Catalog adaptation v2
The curated REBECA-inspired demo batch is now versioned as rebeca-instagram-adapted-v2.

Previously adapted and preserved:
- Pijama Leopardo
- Bralette Seamless Neutro
- Corpiño Moldeado Soft
- Conjunto Infantil Estampado
- Top Morley Color
- Pack Tangas Acanaladas
- Body Encaje Neutro

Added in this pass:
- Bralette Seamless Arena 3D
- Pijama Satén Rosa Animal 3D

All adapted catalog entries are explicitly demo/reference adaptations. Price, size, stock and availability are not represented as official Instagram facts and must be confirmed with REBECA.

New live media verification:
- bralette-seamless-arena-3d: HTTP 200, image/webp, 33402 bytes, SHA/ETag d6e7716af3d34e920f65a85ae74f15aed5e1b63e4ee9445ef76c7c7ab3563ad2.
- pijama-saten-rosa-animal-3d: HTTP 200, image/webp, 82820 bytes, SHA/ETag 821d6ee9b6b8d1fc95cff7c478a7b3ed4f3c43c856fcb78c5c817cc31c27b1fe.

The curated batch mapping is versioned in data/rebeca-catalog-expansion.json. The live media binaries are stored in MEDIA_KV; they are not part of the Worker bundle.

## Firebase redirect-only target
Firebase project alias is rebeca-sf and the requested Hosting URL is https://rebeca-sf.web.app/.

firebase.json is now redirect-only:
- / -> https://rebeca-sf.simondalmasso44.workers.dev/
- /:path* -> https://rebeca-sf.simondalmasso44.workers.dev/:path
- 301 status.
- The previous SPA rewrite to /index.html was removed.

This does not move the backend. Firebase is only a redirect surface; Cloudflare remains canonical runtime and data plane.

Deployment is not yet possible from the connected host because the clean Firebase CLI has no authenticated session. The exact CLI result is: Failed to authenticate, have you run firebase login? No credential was fabricated or extracted.

## GitLab mirror
GitHub remains canonical.
GitLab downstream: https://gitlab.com/simondalmasso/rebeca-sf
Current GitLab main: 3f984da1b7427cc20dfa2083f9b6b1de26a1669a.
GitLab has no feat/order-003-final-close branch at this checkpoint.
Therefore the GitHub -> GitLab server-side mirror is still stale and must not be declared repaired.

## Finalization protocol for this commit
This document is included in the next release-candidate commit, so PRE_COMMIT_HEAD is intentionally the runtime SHA verified before the commit exists. After the commit is pushed:
1. Resolve the exact new branch HEAD.
2. Require fresh GitHub CI verify + browser + Lighthouse success on that exact SHA.
3. Deploy that exact SHA to Cloudflare Worker rebeca-sf using the repository wrangler.toml.
4. Verify /api/health.sha equals the exact new HEAD.
5. Re-verify catalog=25, both new products, both new media URLs, storefront routes, and anonymous admin 401.
6. Record the exact post-commit SHA and acceptance in the PR conversation without another evidence-only commit.
7. Firebase remains pending only on authenticated Hosting deploy.
8. GitLab mirror remains pending until server-side credential repair proves SHA equality.
9. Keep PR Draft and unmerged until independent AUD.
