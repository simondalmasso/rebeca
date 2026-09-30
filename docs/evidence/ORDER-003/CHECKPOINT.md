# ORDER-003 CHECKPOINT

STATUS=BLOCKED_REAL_MIRROR_CREDENTIAL
BRANCH=feat/order-003-final-close
PR=https://github.com/simondalmasso/rebeca/pull/1
CANON=https://github.com/simondalmasso/rebeca
RELEASE_URL=https://rebeca-sf.simondalmasso44.workers.dev/
HEAD_BEFORE_CHECKPOINT_COMMIT=c1b75ba4adaa4b248103db0cdbe915169b291772
CI_EXACT=36687987414 SUCCESS; verify PASS; browser PASS; E2E 6/6; Lighthouse P99/A100/BP100/SEO91 LCP1824ms CLS0.000
LIVE=PASS. Independent edge probes now return HTTP 200 for /, /api/health, /api/catalog, /tienda, /producto/top-alba, /carrito and /checkout.
HEALTH_SHA=c1b75ba4adaa4b248103db0cdbe915169b291772
HEALTH_JSON={"ok":true,"sha":"c1b75ba4adaa4b248103db0cdbe915169b291772","environment":"release","storage":"kv","store":"ok","media":"ok"}
CATALOG=23 products; 23 products with media; 23 media objects; 9 categories.
MEDIA_PROBE=/media/media/demo-product-top-alba/demo-media-top-alba/original.webp => HTTP 200, image/webp, 5808 bytes, ETag ee85cd0678ac84e42f628d539bd39a43b19c281b5f89a65f6f282811d539870b.
ADMIN_ANON=/admin => HTTP 401 with WWW-Authenticate Basic realm="REBECA Admin"; /api/admin/products => HTTP 401. Zero Trust remains prohibited by owner override.
CLOUDFLARE_DIAGNOSIS=The previously reported outage is not reproducing now. Current runtime is healthy and its reported BUILD_SHA exactly matches the branch HEAD before this checkpoint commit. No speculative redeploy was performed because current runtime evidence is green and exact-SHA.
FIREBASE=https://rebeca-sf.web.app/ currently returns HTTP 404 and is not serving the required redirect. ORDER-003 defines Firebase as non-blocking. No Firebase credential/deploy surface is available in this chat, so it remains deferred rather than moving backend away from Cloudflare.
GITLAB_MIRROR=FAIL. GitLab project 86549154 has no feat/order-003-final-close branch. GitHub main=1ecca07aa3dc2768acf0fcdb8fe4b108b5487b1d; GitLab main=3f984da1b7427cc20dfa2083f9b6b1de26a1669a; SHA_MATCH=NO.
LATEST_MIRROR_RUN=36687983223 / run #36 / FAILURE on c1b75ba4adaa4b248103db0cdbe915169b291772.
MIRROR_ERROR=remote: HTTP Basic: Access denied. If a token was provided, it was either incorrect, expired, or improperly scoped. fatal: Authentication failed for 'https://gitlab.com/simondalmasso/rebeca-sf.git/'.
BLOCKER=The mandatory server-side GitHub->GitLab mirror cannot be repaired from the available connector surface: GitHub repository secret writes are not exposed, the connected GitHub fetch API explicitly excludes secrets endpoints, no browser/host execution surface is connected, and the existing GITLAB_MIRROR_TOKEN is proven invalid by run 36687983223.
WHAT_WORKS_NOW=Cloudflare storefront/API/media are live; health storage=kv store=ok media=ok; runtime SHA is exact before this checkpoint commit; catalog has 23 products with media; anonymous admin protection works; GitHub PR #1 remains Draft/open/unmerged; exact pre-checkpoint CI is green.
WHAT_FAILS_NOW=GitHub->GitLab mirror authentication is broken and GitLab is stale; Firebase Hosting returns 404.
WHAT_WAS_DONE=Re-read ORDER-003/REPORT/CHECKPOINT and PR #1; resolved exact GitHub branch HEAD and CI; independently re-probed Cloudflare home/health/catalog/media/admin/shopper routes; parsed live catalog to 23 products/23 media; verified current health SHA; verified Firebase 404; verified GitLab branch absence/main divergence; inspected the exact current mirror job log and reproduced the invalid-token authentication failure.
NEXT_EXACT_ACTION=Rotate GitHub repository secret GITLAB_MIRROR_TOKEN using a durable GitLab credential with repository write scope, rerun .github/workflows/mirror-gitlab.yml, and prove feat/order-003-final-close exists in GitLab at the exact GitHub SHA. Then, because this checkpoint commit advances branch HEAD, require fresh GitHub CI and redeploy that definitive HEAD to rebeca-sf so /api/health.sha equals it. If Firebase credentials are available, deploy the web.app redirect to the Cloudflare canonical URL; otherwise record DEFERRED_NON_BLOCKING. Keep PR #1 Draft and do not merge.
