# ORDER-003 CHECKPOINT

STATUS=CATALOG_V2_LIVE_FINALIZATION_IN_PROGRESS
TIMESTAMP_ART=2026-09-30T13:58:00-03:00
BRANCH=feat/order-003-final-close
PR=https://github.com/simondalmasso/rebeca/pull/1
CANON=https://github.com/simondalmasso/rebeca
PRE_COMMIT_HEAD=8d9a1437852ad0f3a8efd3f792b4e7e1f4776bf1
RELEASE_URL=https://rebeca-sf.simondalmasso44.workers.dev/

CLOUDFLARE_BACKEND=UNCHANGED. Worker + STORE_KV + MEDIA_KV remain authoritative. No replatform, no Firebase backend, no D1/R2 migration, no Zero Trust.
LIVE_HEALTH={"ok":true,"sha":"8d9a1437852ad0f3a8efd3f792b4e7e1f4776bf1","environment":"release","storage":"kv","store":"ok","media":"ok"}
LIVE_CATALOG=25 published products.
CATALOG_CHANGE=Preserved all prior 23 products and added two explicitly demo 3D adaptations: bralette-seamless-arena-3d and pijama-saten-rosa-animal-3d.
MEDIA_V2=Both new media objects are in MEDIA_KV and independently return HTTP 200 image/webp with 800x1000 metadata and SHA-matching ETags.
ASSET_PROVENANCE=The curated adapted batch mapping is versioned in data/rebeca-catalog-expansion.json; media binaries are deployed in MEDIA_KV. Prices, sizes, stock and availability remain marked as illustrative / confirm with REBECA.
NO_DELETIONS=The two older possible catalog overlaps remain preserved pending provenance review.
BUILD_CONFIG=package.json now pins wrangler --config wrangler.toml for dry-run builds so host-global Wrangler config cannot contaminate REBECA verification.

FIREBASE_PROJECT=rebeca-sf
FIREBASE_TARGET=https://rebeca-sf.web.app/
FIREBASE_ROLE=REDIRECT_ONLY to https://rebeca-sf.simondalmasso44.workers.dev/. Backend stays Cloudflare.
FIREBASE_CONFIG=firebase.json now contains 301 root + captured-path redirects to the Worker; the previous SPA rewrite was removed.
FIREBASE_DEPLOY=BLOCKED_AUTH. Clean firebase-tools installation runs correctly but returns "Failed to authenticate, have you run firebase login?". No Firebase credential was read, invented, or substituted.

GITLAB_MIRROR=STILL_STALE. GitLab main=3f984da1b7427cc20dfa2083f9b6b1de26a1669a; feat/order-003-final-close is absent (404). The server-side mirror credential remains the unresolved external dependency.
PR_STATE=Keep Draft / unmerged.

FINALIZATION_RULE=This checkpoint is part of a new release-candidate commit. After commit/push, require fresh GitHub CI on the exact new HEAD, deploy that exact HEAD to Worker rebeca-sf, and prove /api/health.sha equals the new HEAD while catalog remains 25 and both new media URLs remain HTTP 200. Record the final exact SHA in the PR conversation rather than making another evidence-only commit.
