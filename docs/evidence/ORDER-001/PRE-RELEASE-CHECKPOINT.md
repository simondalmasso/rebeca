# ORDER-001 pre-release checkpoint

Capture: 2026-09-17. This is an intermediate evidence record, not a READY_FOR_AUDIT report.

## Verified repository state

- `main`: `05d51abd0abbc77b2f573a289ddb16159eabb75b`.
- Feature branch was rebased onto `main`; Draft MR !1 reports `diverged_commits_count=0` and no conflicts.
- Pre-cleanup feature HEAD: `a5559ec84b93fa280dc75cba86133ae3761bae4f`.
- `release/rebeca-static-rc-v1` remains preserved separately; it is not canonical and must not be merged as a replacement for ORDER-001.
- Pipeline `2858737183` / IID `23` passed at `a5559ec84b93fa280dc75cba86133ae3761bae4f`: quality, unit, integration, build, security and browser E2E all succeeded. Infrastructure/deploy work remains gated.

## Cloudflare blockers verified read-only

R2 is not enabled for the Cloudflare account. `wrangler r2 bucket list` returned Cloudflare code `10042` (`Please enable R2 through the Cloudflare Dashboard`). No R2 bucket was created for REBECA.

D1 is at the Cloudflare account database-count limit. No existing D1 database was deleted, reused or modified for REBECA. A dedicated `rebeca-sf` D1 database therefore cannot be created until the owner frees a slot or the account limit changes.

## Release preparation completed

- `wrangler.toml` uses release origin values and retains only the D1 UUID placeholder until a dedicated `rebeca-sf` database exists.
- CI contains gated `deploy_cloudflare` and `smoke_cloudflare` jobs after the existing functional gates.
- Deployment is intentionally impossible while the D1 placeholder remains or required Cloudflare/Access CI variables are absent.
- `scripts/smoke-cloudflare.mjs` checks `/api/health`, exact deployed SHA, DB health, `/`, and `/api/catalog`.
- Fourteen demo clothing source images are committed under `data/demo-media-source/`; `data/catalog-source-manifest.json` records SHA-256 provenance and leaves R2 keys null pending the real R2 upload flow.
- All seeded catalog imagery remains `demo_generated`; it is proposal material, not confirmed Rebeca inventory.

## Deferred by hard external gates

1. Owner must activate R2 for the Cloudflare account. No payment or subscription action was attempted.
2. A dedicated D1 slot must become available for `rebeca-sf`. No existing database deletion or reuse is authorized by ORDER-001.
3. GitLab requires a dedicated minimum-privilege `CLOUDFLARE_API_TOKEN` plus `CLOUDFLARE_ACCOUNT_ID`; local Wrangler OAuth must not be copied into CI.
4. Cloudflare Access requires the real owner/admin email allowlist and resulting team domain before the final CI deploy.
5. Firebase Hosting remains a static mirror only and is deferred until the canonical Cloudflare release is healthy.

## Stop conditions

Do not deploy the static RC as canonical. Do not delete or reuse any existing D1. Do not claim R2, Access, canonical deploy, Firebase mirror, Lighthouse or final release evidence PASS until each is exercised against the real REBECA release environment.

This evidence record intentionally contains only REBECA-SF facts and constraints. Infrastructure details from unrelated projects are out of scope and must not appear in REBECA documentation.
