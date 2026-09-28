# ORDER-003 CHECKPOINT

STATUS=FINALIZATION
BRANCH=feat/order-003-final-close
PR=https://github.com/simondalmasso/rebeca/pull/1
CANON=https://github.com/simondalmasso/rebeca
RELEASE_URL=https://rebeca-sf.simondalmasso44.workers.dev/
CURRENT_PHASE=Implementation, production deploy, remote shopper/admin/media/import acceptance, live mobile/desktop QA, axe, screenshots and REPORT.md are complete. No runtime defect remains evidenced. The next mandatory step is to take the commit containing this checkpoint as definitive HEAD, require fresh GitHub CI green, deploy that exact HEAD with BUILD_SHA=<HEAD>, and verify /api/health.sha==HEAD. After that, only the GitHub->GitLab mirror credential gate may remain.
PRE_REPORT_DEPLOY_SHA=b834721610171646774e0e4f515f639f523f6909
PRE_REPORT_CLOUDFLARE_VERSION=3236c853-018e-40e8-9067-b7a6ac90e1b6
PRE_REPORT_HEALTH=PASS storage=kv store=ok media=ok catalog=14
PRE_REPORT_GITHUB_CI=36397610000 SUCCESS; E2E 6/6; Lighthouse P99/A100/BP100/SEO91 LCP1797ms CLS0.000
REMOTE_ACCEPTANCE=health exact SHA PASS; catalog 14 PASS; anonymous admin 401 PASS; wrong credentials 401 PASS; authenticated admin products 14 PASS; top-alba edit reflected publicly and restored PASS; media upload/read(HTTP200 image/webp 5808 bytes)/reorder/restore/delete PASS; import preview/apply/reapply idempotency PASS (second apply skip=1 create=0 update=0); product restored PASS.
BROWSER_ACCEPTANCE=mobile 390x844 Home/PLP/PDP/Cart/Checkout overflow=0; desktop 1440x900 overflow=0; console errors=0; page errors=0; admin UI PASS; axe 0 critical/0 serious on /,/tienda,/producto/top-alba,/carrito,/checkout.
EVIDENCE=docs/evidence/ORDER-003/REPORT.md plus docs/evidence/ORDER-003/screenshots/*
AUTHORITY_OVERRIDE=Owner explicitly rejected Cloudflare Zero Trust. Do not configure it. Admin protection is Worker-native Basic Auth; ADMIN_PASSWORD exists only as a Cloudflare Worker secret and must not be printed/committed.
RUNTIME_CONTRACT=Production only on Cloudflare Worker/KV. PC is ephemeral test/config only. No local server/scheduler/runtime may remain.
MIRROR_BLOCKER=Server-side GitHub->GitLab workflow exists but GITLAB_MIRROR_TOKEN is invalid/expired. GitLab connector cannot create project tokens and dedicated Brave is not authenticated to GitLab. Do not add a host-based mirror or reuse unrelated credentials.
RESUME_EXACT=1) Read docs/orders/ORDER-003.md, REPORT.md and this file. 2) git fetch origin and verify feat/order-003-final-close HEAD. 3) Require GitHub CI verify+browser+Lighthouse SUCCESS on that exact HEAD. 4) Deploy that exact HEAD to Cloudflare Worker rebeca-sf with BUILD_SHA=<HEAD> and existing STORE_KV/MEDIA_KV/admin secret. 5) Verify /api/health.sha==HEAD, health ok, catalog=14, public home=200, anonymous /admin=401 Basic challenge, authenticated admin remains reachable. 6) If mirror token authority becomes available, replace GitHub Actions secret GITLAB_MIRROR_TOKEN with a rebeca-sf write_repository credential, rerun mirror workflow and prove matching SHA. 7) Keep PR Draft/unmerged. 8) Return READY_FOR_FINAL_AUDIT only if mirror is also repaired; otherwise BLOCKED_REAL with only the mirror credential gate.
