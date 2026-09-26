# REBECA-SF ERP integration contract

## Canonical boundary
All catalog writes converge on `CanonicalProductInput` and `CatalogService.upsertProduct()`. Manual admin, CSV and JSON are current adapters. A future ERP adds transport plus an adapter; it does not create a second catalog, database, price engine or storefront API.

## Provider adapter
An ERP adapter implements `CatalogSourceAdapter<ProviderPayload>` and maps provider fields into canonical products/variants. `source='erp'`, `sourceName=<provider>`, and stable `externalId` values are mandatory for records managed by the ERP. Provider-native payloads do not leak beyond the adapter.

## Pull
For an ERP with read APIs, a scheduled or operator-triggered job reads changed records using provider cursors/timestamps, maps them through the adapter, performs a dry-run, then calls the existing catalog service. Pull state stores only the provider cursor required for resumption; D1 remains the runtime storefront catalog.

## Push / webhook
For providers with webhooks, the endpoint first authenticates the provider signature, persists/derives an idempotency key, maps the event through the same adapter, and invokes `CatalogService`. Webhook delivery order must not be trusted. Provider event IDs and external product IDs prevent duplicate mutation.

## Scheduled sync
A scheduled sync is appropriate when webhooks are absent or incomplete. It should request only a bounded delta, apply canonical validation, and update the sync cursor only after the batch succeeds. Full imports remain a recovery mechanism rather than the default loop.

## External IDs and idempotency
`(external_source, external_id)` identifies an externally managed product. Stable variant external IDs/SKUs identify variants. File imports use a canonical checksum. Replaying the same provider event or file must not create a second product.

## Conflict policy
The future integration must explicitly declare field ownership. If the ERP is source of truth, ERP-owned price/SKU/stock fields overwrite local values while editorial copy/media may remain locally owned. If ownership is mixed, conflicts are resolved field-by-field from a documented mapping; last-write-wins is not the default.

## Mapping and validation
Currency remains `ARS`; money enters as integer centavos. Product status maps only to `draft|published|archived`; availability only to `available|out_of_stock|preorder`. Invalid provider records are rejected with row/entity errors and do not silently coerce or corrupt valid records.

## Source of truth
D1 is the operational catalog consumed by `/api/catalog`. R2 is the source of truth for owner-uploaded media. A future ERP may become authoritative for selected business fields, but the adapter writes those fields into the existing D1 model. The storefront never reads the ERP directly.

## Observability and rollback
Each applied external mutation records actor/source, entity, before/after snapshots and import/sync identifiers in the existing audit path. A failed batch does not advance its cursor. Rollback restores canonical D1 records; it does not introduce an alternate read path.
