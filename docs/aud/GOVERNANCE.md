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
- No merge, deploy or production mutation unless explicitly ordered.

## Operating rule

- ARQ does not wait for AUD during internal construction of an approved tranche.
- AUD does not intervene until ARQ publishes a material, auditable checkpoint.
- Deploy should be automated from the repository when practical, with Cloudflare as the primary production target.
- Numbered orders and material checkpoints are documented in the canonical repository; Google Drive may additionally hold historical or mirrored authority documents.
- Evidence required by an order is committed under the repository evidence paths defined by that order.

## Current canonical execution order

`ORDER-001 — REBECA-SF MASTER IMPLEMENTATION ORDER`
Repository path: `docs/orders/ORDER-001.md`

`ORDER-001` authorizes ARQ to build the complete release candidate, including a gated Cloudflare release-candidate deployment, and requires ARQ to return control to AUD for independent audit before merge/final production cutover.

## Historical authority

`AUD-001 — Constitución y Arquitectura V1`
Google Drive: https://docs.google.com/document/d/1CyCkFoVxGA0MSVU5O8l1_mel5Rn4ym1GRPO_A-Paoms/edit

`ORDER-001` extends and supersedes `AUD-001` for implementation while preserving the role separation and evidence-before-verdict rules.

## Current state

The repository has been bootstrapped and the implementation tranche is now authorized exclusively by `ORDER-001`. AUD remains read/audit/design authority; ARQ owns implementation until the final material checkpoint is published.
