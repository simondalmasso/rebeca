# ORDER-003 CHECKPOINT

STATUS=FINAL_EVIDENCE_COMMITTED_PENDING_EXACT_SHA_REDEPLOY
BRANCH=feat/order-003-final-close
PR=https://github.com/simondalmasso/rebeca/pull/1
CANON=https://github.com/simondalmasso/rebeca
RELEASE_URL=https://rebeca-sf.simondalmasso44.workers.dev/
CURRENT_PHASE=Implementation, production deploy, remote shopper/admin/media/import acceptance, mobile-first live QA, axe, production Lighthouse, screenshots and final REPORT.md are complete. The commit containing this checkpoint/report is the definitive evidence candidate. No more repo commits are expected unless a real defect is discovered. Next mandatory step: fresh GitHub CI on the exact branch HEAD containing this file, then deploy that exact HEAD with BUILD_SHA=<HEAD> and prove /api/health.sha==HEAD.
PRE_FINAL_DEPLOY_SHA=b834721610171646774e0e4f515f639f523f6909
PRE_FINAL_CLOUDFLARE_VERSION=3236c853-018e-40e8-9067-b7a6ac90e1b6
PRE_FINAL_HEALTH=PASS storage=kv store=ok media=ok catalog=14 home=200 admin_anon=401 api_admin_anon=401
PRE_FINAL_GITHUB_CI=36397610000 SUCCESS; E2E 6/6; CI Lighthouse P99/A100/BP100/SEO91 LCP1797ms CLS0.000
PRODUCTION_LIGHTHOUSE=P99/A100/BP100/SEO92 LCP1716ms CLS0.025
REMOTE_ACCEPTANCE=public shopper PASS; mobile 390x844 overflow=0; desktop 1440x900 overflow=0; console/page errors=0; axe 0 critical/0 serious; authenticated admin product mutation reflected publicly and restored; media upload/read/reorder/delete restored; import update then second-apply skip idempotency PASS; catalog/provenance restored.
EVIDENCE=docs/evidence/ORDER-003/REPORT.md + docs/evidence/ORDER-003/lighthouse-production-summary.json + docs/evidence/ORDER-003/screenshots/*
AUTHORITY_OVERRIDE=Owner explicitly rejected Cloudflare Zero Trust. Do not configure it. Admin protection is Worker-native Basic Auth. ADMIN_PASSWORD exists only as a Cloudflare Worker secret and must not be printed or committed.
RUNTIME_CONTRACT=Production only on Cloudflare Worker/KV. PC is ephemeral test/config only. No local server/scheduler/runtime may remain. No mouse/keyboard automation.
MIRROR_GATE=Server-side GitHub->GitLab workflow exists but GITLAB_MIRROR_TOKEN is invalid/expired. Do not add a host-based mirror. Close only with a durable rebeca-sf write_repository credential stored as GitHub Actions secret and prove SHA equality.
RESUME_EXACT=1) Fetch origin and resolve current feat/order-003-final-close HEAD; that HEAD is the definitive evidence candidate. 2) Read docs/orders/ORDER-003.md, REPORT.md and this checkpoint. 3) Require GitHub CI verify+browser+Lighthouse SUCCESS on that exact HEAD. 4) Deploy that exact HEAD to Cloudflare Worker rebeca-sf with BUILD_SHA=<HEAD> and existing STORE_KV/MEDIA_KV/ADMIN_PASSWORD secret. 5) Verify /api/health.sha==HEAD, health ok, catalog=14, Home=200, anonymous /admin=401 Basic challenge and anonymous /api/admin/products=401. 6) Do not create another repo commit after successful exact-SHA verification. 7) If GitLab token authority is available, rotate GITLAB_MIRROR_TOKEN, rerun mirror, prove GitHub/GitLab SHA equality. 8) Keep PR Draft/unmerged. 9) Return READY_FOR_FINAL_AUDIT only if the mirror gate is also closed; otherwise BLOCKED_REAL with only the exact mirror credential blocker.
