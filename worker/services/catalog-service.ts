import {
  canonicalProductSchema,
  type CanonicalProductInput,
  type PublicCategory,
  type PublicMedia,
  type PublicProduct,
  type PublicVariant,
} from '../../shared/catalog-contract';
import storefrontCatalog from '../../data/rebeca-catalog-expansion.json';
import { categoryInputSchema, storeSettingsInputSchema } from '../../shared/schemas';
import type { StoreRepository } from '../repositories/store-repository';
import type { StoreStateV1, StoredCategory, StoredProduct } from '../store-state';

export type AdminProduct = PublicProduct & {
  status: 'draft' | 'published' | 'archived';
  sourceKind: CanonicalProductInput['source'];
  sourceName: string | null;
  externalId: string | null;
  demoData: boolean;
  categorySlug: string | null;
  updatedAt: string;
};

const now = () => new Date().toISOString();
const uid = () => crypto.randomUUID();
const categoryName = (slug: string) => slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
const curatedBySlug = new Map(storefrontCatalog.products.map((product) => [product.slug, product]));
const isStorefrontProduct = (state: StoreStateV1, product: StoredProduct) =>
  curatedBySlug.has(product.slug) ||
  (!product.demoData && product.source !== 'demo_generated' && product.source !== 'instagram_public') ||
  (state.settings.demoMode && product.source === 'demo_generated' && product.sourceName === 'rebeca-demo-v1');

function audit(state: StoreStateV1, actor: string, action: string, entityType: string, entityId: string, before: unknown, after: unknown) {
  state.auditEvents.push({ id: uid(), actor, action, entityType, entityId, before, after, createdAt: now() });
}
function publicCategory(category: StoredCategory | null): PublicCategory | null {
  return category ? { id: category.id, slug: category.slug, name: category.name, description: category.description ?? null, sortOrder: category.sortOrder } : null;
}

export class CatalogService {
  constructor(public readonly repo: StoreRepository) {}

  findExistingInState(state: StoreStateV1, input: CanonicalProductInput) {
    if (input.externalId) {
      const source = input.sourceName ?? input.source;
      const match = state.products.find((product) => (product.sourceName ?? product.source) === source && product.externalId === input.externalId);
      if (match) return match.id;
    }
    return state.products.find((product) => product.slug === input.slug)?.id ?? null;
  }
  async findExisting(input: CanonicalProductInput) { return this.findExistingInState(await this.repo.read(), input); }

  private ensureCategory(state: StoreStateV1, slug?: string) {
    if (!slug) return null;
    let category = state.categories.find((item) => item.slug === slug);
    if (category) return category;
    const timestamp = now();
    category = { id: uid(), slug, name: categoryName(slug), description: null, sortOrder: state.categories.length, active: true, updatedAt: timestamp };
    state.categories.push(category);
    return category;
  }

  upsertProductInState(state: StoreStateV1, raw: CanonicalProductInput, actor: string, forcedId?: string) {
    const input = canonicalProductSchema.parse(raw);
    const existingId = forcedId ?? this.findExistingInState(state, input);
    const index = existingId ? state.products.findIndex((product) => product.id === existingId) : -1;
    if (forcedId && index < 0) throw new Error('product_not_found');
    this.ensureCategory(state, input.categorySlug);
    const previous = index >= 0 ? structuredClone(state.products[index]) : null;
    const timestamp = now();
    const id = existingId ?? uid();
    const prior = previous?.variants ?? [];
    const variants = input.variants.map((variant, variantIndex) => ({
      ...variant,
      id: prior.find((item) => (variant.externalId && item.externalId === variant.externalId) || (variant.sku && item.sku === variant.sku))?.id ?? prior[variantIndex]?.id ?? uid(),
    }));
    const next: StoredProduct = { ...input, id, variants, media: previous?.media ?? [], createdAt: previous?.createdAt ?? timestamp, updatedAt: timestamp };
    if (index >= 0) state.products[index] = next; else state.products.push(next);
    audit(state, actor, index >= 0 ? 'product.update' : 'product.create', 'product', id, previous, next);
    return { id, created: index < 0 };
  }

  async upsertProduct(input: CanonicalProductInput, actor: string) { return this.repo.mutate((state) => this.upsertProductInState(state, input, actor)); }
  async updateProduct(id: string, input: CanonicalProductInput, actor: string) { return this.repo.mutate((state) => this.upsertProductInState(state, input, actor, id)); }

  private toPublic(state: StoreStateV1, product: StoredProduct): PublicProduct {
    const curated = curatedBySlug.get(product.slug);
    const storedCategory = product.categorySlug ? state.categories.find((item) => item.slug === product.categorySlug && item.active) ?? null : null;
    const category = publicCategory(storedCategory);
    const publicCategoryValue = curated && category ? { ...category, name: curated.categoryName } : category;
    const rawVariants: PublicVariant[] = product.variants.map((variant) => ({
      id: variant.id, sku: variant.sku ?? null, size: variant.size ?? null, color: variant.color ?? null,
      priceOverrideCents: variant.priceOverrideCents ?? null, availability: variant.availability,
      stockQty: variant.stockQty ?? null, active: variant.active,
    }));
    const variants = curated && rawVariants.length ? [{
      ...(rawVariants.find((variant) => variant.active) ?? rawVariants[0]),
      sku: null, size: null, color: null, priceOverrideCents: null,
      availability: 'available' as const, stockQty: null, active: true,
    }] : rawVariants;
    const title = curated?.title ?? product.title;
    const media: PublicMedia[] = product.media.slice().sort((a,b)=>a.sortOrder-b.sortOrder).map((item)=>({
      id:item.id, altText:curated?title:item.altText, originalKey:item.originalKey,
      smallKey:item.smallKey, largeKey:item.largeKey, width:item.width, height:item.height,
    }));
    return {
      id:product.id, slug:product.slug, title, subtitle:curated?null:product.subtitle??null,
      description:curated?'':product.description, priceCents:curated?.priceCents??product.priceCents,
      compareAtPriceCents:curated?null:product.compareAtPriceCents??null, currency:'ARS',
      featured:curated?.featured??product.featured, category:publicCategoryValue, media, variants,
    };
  }

  private toAdmin(state: StoreStateV1, product: StoredProduct): AdminProduct {
    return {
      ...this.toPublic(state,product),
      category:publicCategory(product.categorySlug?state.categories.find((item)=>item.slug===product.categorySlug)??null:null),
      status:product.status, sourceKind:product.source, sourceName:product.sourceName??null,
      externalId:product.externalId??null, demoData:product.demoData, categorySlug:product.categorySlug??null, updatedAt:product.updatedAt,
    };
  }

  async listPublic() {
    const state=await this.repo.read();
    const products=state.products.filter((product)=>product.status==='published'&&isStorefrontProduct(state,product)).map((product)=>this.toPublic(state,product));
    const categories=new Map<string,PublicCategory>();
    for(const product of products) if(product.category) categories.set(product.category.slug,product.category);
    return {products,categories:[...categories.values()].sort((a,b)=>a.sortOrder-b.sortOrder||a.name.localeCompare(b.name))};
  }

  async getPublicBySlug(slug:string) {
    const state=await this.repo.read();
    const product=state.products.find((item)=>item.slug===slug&&item.status==='published'&&isStorefrontProduct(state,item));
    return product?this.toPublic(state,product):null;
  }

  async listAdmin(){const state=await this.repo.read();return{products:state.products.slice().sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)||a.title.localeCompare(b.title)).map((p)=>this.toAdmin(state,p))};}
  async getAdminProduct(id:string){const state=await this.repo.read();const p=state.products.find((x)=>x.id===id);return p?this.toAdmin(state,p):null;}
  async setStatus(id:string,status:AdminProduct['status'],actor:string){return this.repo.mutate((state)=>{const p=state.products.find((x)=>x.id===id);if(!p)throw new Error('product_not_found');const before=structuredClone(p);p.status=status;p.updatedAt=now();audit(state,actor,'product.'+status,'product',id,before,p);return this.toAdmin(state,p);});}
  async duplicateProduct(id:string,actor:string){return this.repo.mutate((state)=>{const p=state.products.find((x)=>x.id===id);if(!p)throw new Error('product_not_found');let slug=p.slug+'-copia',n=2;while(state.products.some((x)=>x.slug===slug))slug=p.slug+'-copia-'+n++;const input:CanonicalProductInput={slug,title:p.title+' copia',subtitle:p.subtitle,description:p.description,categorySlug:p.categorySlug,priceCents:p.priceCents,compareAtPriceCents:p.compareAtPriceCents,currency:'ARS',status:'draft',featured:false,variants:p.variants.map((v)=>({size:v.size,color:v.color,priceOverrideCents:v.priceOverrideCents,availability:v.availability,stockQty:v.stockQty,active:v.active})),source:'manual',sourceName:'admin',demoData:p.demoData};return this.upsertProductInState(state,input,actor);});}
  async exportCanonical(){const state=await this.repo.read();return state.products.map((p)=>canonicalProductSchema.parse({externalId:p.externalId,slug:p.slug,title:p.title,subtitle:p.subtitle,description:p.description,categorySlug:p.categorySlug,priceCents:p.priceCents,compareAtPriceCents:p.compareAtPriceCents,currency:'ARS',status:p.status,featured:p.featured,variants:p.variants.map((v)=>({externalId:v.externalId,sku:v.sku,size:v.size,color:v.color,priceOverrideCents:v.priceOverrideCents,availability:v.availability,stockQty:v.stockQty,active:v.active})),source:p.source,sourceName:p.sourceName,demoData:p.demoData}));}
  async listCategories(){const state=await this.repo.read();return{categories:state.categories.slice().sort((a,b)=>a.sortOrder-b.sortOrder||a.name.localeCompare(b.name))};}
  async createCategory(raw:unknown,actor:string){const input=categoryInputSchema.parse(raw);return this.repo.mutate((state)=>{if(state.categories.some((c)=>c.slug===input.slug))throw new Error('duplicate_slug');const category:StoredCategory={id:uid(),...input,description:input.description??null,updatedAt:now()};state.categories.push(category);audit(state,actor,'category.create','category',category.id,null,category);return{id:category.id};});}
  async updateCategory(id:string,raw:unknown,actor:string){const input=categoryInputSchema.parse(raw);return this.repo.mutate((state)=>{const category=state.categories.find((c)=>c.id===id);if(!category)throw new Error('category_not_found');if(state.categories.some((c)=>c.id!==id&&c.slug===input.slug))throw new Error('duplicate_slug');const before=structuredClone(category);Object.assign(category,input,{description:input.description??null,updatedAt:now()});audit(state,actor,'category.update','category',id,before,category);return{ok:true};});}
  async getSettings(){return(await this.repo.read()).settings;}
  async updateSettings(raw:unknown,actor:string){const input=storeSettingsInputSchema.parse(raw);return this.repo.mutate((state)=>{const before=structuredClone(state.settings);state.settings={...state.settings,...input,updatedAt:now()};audit(state,actor,'settings.update','settings','store',before,state.settings);return{ok:true};});}
}
