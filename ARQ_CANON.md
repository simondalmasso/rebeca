# ARQ_CANON

## PROJECT / PURPOSE / REPO / LIVE
- PROJECT: REBECA-SF
- PURPOSE: close the existing fashion ecommerce proposal and ship a verified release candidate.
- CANON: https://github.com/simondalmasso/rebeca
- GITLAB: downstream mirror only
- LIVE: https://rebeca-sf.simondalmasso44.workers.dev/
- ACTIVE ORDER: https://github.com/simondalmasso/rebeca/blob/main/docs/orders/ORDER-003.md

## LAST_VERIFIED / BRANCH / HEAD
- LAST_VERIFIED: 2026-09-26
- START: latest GitHub `main` containing ORDER-003
- CREATE: `feat/order-003-final-close`
- PR: Draft -> `main`, never merge before AUD
- GitHub->GitLab mirror is server-side and already proven.

## CURRENT STATE
- preserve React 19 + Vite + React Router + Hono + Workers KV.
- STORE_KV=`616f4a65e5ab4629a8bb281ecc18a22c`
- MEDIA_KV=`a83b4db8a6ad4b3e91dbe900db088cdc`
- deterministic demo seed = 14 products + 14 media; whatsappNumber=null.
- Access + final deploy + remote release acceptance are unfinished.
- design direction is fixed by ORDER-003: `REBECA_EDITORIAL_COMMERCE`.
- do not replatform.

## DONE
- existing storefront/admin/cart/PDP/checkout
- KV persistence
- D1/R2 cleanup
- demo catalog/media
- GitHub migration
- automatic server-side GitHub->GitLab mirror
- research shortlist

## ACTIVE WORK
ORDER-003: bounded design refinement -> fresh GitHub CI -> Access -> exact-SHA deploy -> remote acceptance -> evidence -> final AUD.

## PENDING
Everything explicitly listed as mandatory in ORDER-003.

## BLOCKERS/RISKS
- BLOCKED_REAL=NO until proven otherwise with exact external error evidence.
- plugin/tool outage is not a blocker.
- no production WhatsApp number is not a blocker.

## DO_NOT_TOUCH
- other projects
- D1/R2
- payments
- direct GitLab implementation
- host-based mirroring
- framework/backend migration
- merge before AUD

## AUTHORITIES/GATES
- ORDER-003 supersedes unfinished ORDER-002 execution.
- final deployed `/api/health.sha` must equal final GitHub HEAD after evidence commit.
- fresh GitHub CI must be green.
- Access must protect only admin UI/API.
- remote public/admin/media/import acceptance mandatory.

## WHERE_TO_RESUME
Start ORDER-003 at Phase A from latest GitHub main. Do not redo migration, KV provisioning, seed or mirror.

## WHAT_TO_DO_NOW
Read ORDER-003 once, then execute it continuously. Create `feat/order-003-final-close` and Draft PR; audit/refine the existing UI to REBECA_EDITORIAL_COMMERCE using the bounded references; add current GitHub CI; finish Access; deploy exact final SHA; run all remote acceptance; commit `docs/evidence/ORDER-003/REPORT.md`; redeploy the definitive evidence HEAD; verify health SHA and GitLab mirror; return READY_FOR_FINAL_AUDIT.

## WHAT_NOT_TO_REPEAT
- architecture research
- ecommerce repo research
- design-direction debate
- KV pivot/provisioning
- demo catalog generation
- GitHub migration
- mirror setup
- D1/R2 investigation

## ACCEPTANCE/STOP CONDITIONS
ACCEPT only when ORDER-003 Definition of Done is fully evidenced and PR remains unmerged.
STOP only for a proven external restriction that prevents the next mandatory action after safe troubleshooting.

## ARQ HANDOFF
```text
PROJECT=REBECA-SF
ROLE=ARQ
ORDER=ORDER-003
CANON=https://github.com/simondalmasso/rebeca
ORDER_URL=https://github.com/simondalmasso/rebeca/blob/main/docs/orders/ORDER-003.md
Execute ORDER-003 end-to-end from latest main. Preserve the existing architecture, implement REBECA_EDITORIAL_COMMERCE, finish GitHub CI + Access + exact-SHA deploy + remote acceptance + evidence, verify GitHub->GitLab mirror, and return only READY_FOR_FINAL_AUDIT or proven BLOCKED_REAL. No merge. No intermediate handoff.
```

PLUGINS_4_THIS_TASK=`@GitHub @01-superdesign @ux-pilot @Product Design @thoughtfulbits-skills @Skillquiver`