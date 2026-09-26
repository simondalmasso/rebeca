import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const outDir = new URL("../.wrangler/release-seed/", import.meta.url);
const catalog = JSON.parse(
  await readFile(new URL("../data/demo-catalog.json", import.meta.url), "utf8"),
);
const manifest = JSON.parse(
  await readFile(
    new URL("../data/catalog-source-manifest.json", import.meta.url),
    "utf8",
  ),
);

if (catalog.length !== 14 || manifest.products.length !== catalog.length) {
  throw new Error(
    `release_seed_catalog_mismatch catalog=${catalog.length} manifest=${manifest.products.length}`,
  );
}

const fixedAt = manifest.generated_at;
const titleCase = (slug) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const bySlug = new Map(manifest.products.map((entry) => [entry.slug, entry]));
const categorySlugs = [
  ...new Set(catalog.map((product) => product.categorySlug).filter(Boolean)),
];
const categories = categorySlugs.map((slug, index) => ({
  id: `demo-category-${slug}`,
  slug,
  name: titleCase(slug),
  description: null,
  sortOrder: index,
  active: true,
  updatedAt: fixedAt,
}));

const mediaBulk = [];
const products = [];
for (const product of catalog) {
  if (product.source !== "demo_generated" || product.demoData !== true) {
    throw new Error(`release_seed_non_demo_product ${product.slug}`);
  }
  const source = bySlug.get(product.slug);
  if (
    !source ||
    source.source_kind !== "demo_generated" ||
    source.media?.length !== 1
  ) {
    throw new Error(`release_seed_manifest_invalid ${product.slug}`);
  }
  const mediaSource = source.media[0];
  const bytes = await readFile(
    new URL(
      `../${mediaSource.source_file.replaceAll("\\", "/")}`,
      import.meta.url,
    ),
  );
  const digest = sha256(bytes);
  if (digest !== mediaSource.sha256)
    throw new Error(`release_seed_sha_mismatch ${product.slug}`);
  const productId = `demo-product-${product.slug}`;
  const mediaId = `demo-media-${product.slug}`;
  const originalKey = `media/${productId}/${mediaId}/original.webp`;
  mediaBulk.push({
    key: originalKey,
    value: bytes.toString("base64"),
    base64: true,
    metadata: { contentType: "image/webp", sha256: digest },
  });
  const media = [
    {
      id: mediaId,
      altText: `${product.title} · imagen ilustrativa demo`,
      originalKey,
      smallKey: null,
      largeKey: null,
      sourceUrl: null,
      sourceKind: "demo_generated",
      sha256: digest,
      width: mediaSource.width,
      height: mediaSource.height,
      contentType: "image/webp",
      sortOrder: 0,
      createdAt: fixedAt,
      updatedAt: fixedAt,
    },
  ];
  products.push({
    ...product,
    id: productId,
    variants: product.variants.map((variant, index) => ({
      ...variant,
      id: `demo-variant-${product.slug}-${index + 1}`,
    })),
    media,
    createdAt: fixedAt,
    updatedAt: fixedAt,
  });
}

const revision = 1;
const state = {
  schemaVersion: 1,
  revision,
  products,
  categories,
  settings: {
    storeName: "REBECA",
    instagramUrl: "https://www.instagram.com/rebeca_santafee/",
    whatsappNumber: null,
    deliveryLabel: "Coordinar envío",
    pickupLabel: "Retiro",
    demoMode: true,
    catalogRevision: revision,
    updatedAt: fixedAt,
  },
  importRuns: [],
  auditEvents: [],
  updatedAt: fixedAt,
};

mediaBulk.push({
  key: "media:sentinel",
  value: JSON.stringify({
    schemaVersion: 1,
    mediaCount: mediaBulk.length,
    generatedAt: fixedAt,
  }),
  metadata: { kind: "release-seed-sentinel", mediaCount: mediaBulk.length },
});

await mkdir(outDir, { recursive: true });
await writeFile(
  new URL("store-state.json", outDir),
  `${JSON.stringify(state, null, 2)}\n`,
);
await writeFile(
  new URL("media-bulk.json", outDir),
  `${JSON.stringify(mediaBulk, null, 2)}\n`,
);
await writeFile(
  new URL("manifest.json", outDir),
  `${JSON.stringify(
    {
      schemaVersion: 1,
      products: products.length,
      demoProducts: products.filter((product) => product.demoData).length,
      mediaObjects: mediaBulk.filter((entry) => entry.key.startsWith("media/"))
        .length,
      sentinelKey: "media:sentinel",
      generatedAt: fixedAt,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `KV_RELEASE_SEED=PASS products=${products.length} media=${mediaBulk.length - 1} whatsapp=null`,
);
