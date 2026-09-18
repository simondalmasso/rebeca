# REBECA-SF — Governance

Project: `rebeca-sf`
Canonical repository: `simondalmasso/rebeca-sf`

## Role lock

### AUD
- Brain, direction, audit and research.
- Planning, architecture, economic verification, risk analysis and test design.
- Independent gatekeeping and master-order drafting.
- Evidence before verdict.
- No implementation or correction unless explicitly ordered.

### ARQ
- Construction, operation, execution and implementation.
- Build, refactor, integrate, test, verify, debug and document.
- Technical autonomy inside an approved tranche.
- Verify > assume; root cause > superficial patch; end-to-end > green CI alone.
- No merge unless explicitly ordered.

## Operating rule

- ARQ does not wait for AUD during internal construction of an approved tranche.
- AUD does not intervene until ARQ publishes a material, auditable checkpoint.
- Numbered orders and material checkpoints are documented in the canonical repository; Google Drive may additionally hold historical or mirrored authority documents.
- Evidence required by an order is committed under the repository evidence paths defined by that order.
- Cloudflare is the canonical release target for REBECA-SF.
- ORDER-002 explicitly authorizes a release-candidate deployment from an authenticated interactive Wrangler/operator session when GitLab CI Cloudflare credentials are absent.
- No merge to `main` occurs before final AUD verdict.

## Current canonical execution order

`ORDER-002 — REBECA-SF FINALIZE + DEPLOY FAST-PATH`

Repository path: `docs/orders/ORDER-002.md`

ORDER-002 is the sole active execution order for the current closing tranche. It authorizes ARQ to continue the existing implementation branch through the real Cloudflare release candidate and remote verification without returning to AUD between normal implementation/infrastructure steps.

ORDER-002 explicitly overrides the remaining ORDER-001 release blockers by moving release persistence from D1/R2 to REBECA-specific Workers KV namespaces and by allowing authenticated interactive Wrangler deployment instead of requiring GitLab CI deployment credentials.

## Preserved ORDER-001 authority

`ORDER-001 — REBECA-SF MASTER IMPLEMENTATION ORDER`
Repository path: `docs/orders/ORDER-001.md`

ORDER-001 remains authoritative for already-implemented product behavior and requirements not explicitly changed by ORDER-002, including:

- storefront/cart/PDP/checkout behavior
- no payment/card collection
- deterministic WhatsApp order construction
- owner-facing admin UX
- canonical catalog DTO/service/ERP seam
- import/export/idempotency
- demo provenance honesty
- responsive/accessibility/performance expectations
- secret/security rules
- evidence-before-verdict

Where ORDER-001 requires D1, R2, GitLab-token deployment or treats the absence of a real WhatsApp destination as a release blocker, ORDER-002 controls.

## Historical authority

`AUD-001 — Constitución y Arquitectura V1`
Google Drive: https://docs.google.com/document/d/1CyCkFoVxGA0MSVU5O8l1_mel5Rn4ym1GRPO_A-Paoms/edit

ORDER-001 superseded AUD-001 for implementation. ORDER-002 now supersedes the remaining release/infrastructure tranche of ORDER-001 while preserving the governance and product rules above.

## Current state

The audited implementation checkpoint is `ef0f8ee2834da81eecc428a1c1b5d6cf3e328417` on `feat/order-001-rebeca-v1`, MR `!1`.

ARQ is authorized to rebase that branch onto current `main`, execute ORDER-002 continuously to `READY_FOR_FINAL_AUDIT`, provision only REBECA-specific Cloudflare resources, deploy the release candidate and produce final evidence.

AUD resumes control only after that final checkpoint or a proven ORDER-002-allowed `BLOCKED_REAL`.
