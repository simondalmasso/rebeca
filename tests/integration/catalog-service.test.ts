import { beforeEach,describe,expect,it } from 'vitest';
import { CatalogService } from '../../worker/services/catalog-service';
import { ImportService } from '../../worker/services/import-service';
import { KvStoreRepository,StoreWriteRateLimitedError } from '../../worker/repositories/store-repository';
import { STORE_STATE_KEY,storeStateSchema } from '../../worker/store-state';
import { TestKv } from './kv-shim';

let store:TestKv,repo:KvStoreRepository,service:CatalogService;
const product={externalId:'A-1',slug:'top-alba',title:'Top Alba',description:'Demo',categorySlug:'tops-remeras',priceCents:2500000,currency:'ARS' as const,status:'draft' as const,featured:true,variants:[{sku:'A-1-M',size:'M',color:'Negro',availability:'available' as const,stockQty:null,active:true}],source:'manual' as const,sourceName:'admin',demoData:false};

beforeEach(()=>{store=new TestKv();repo=new KvStoreRepository(store.asNamespace(),{bootstrapIfMissing:true});service=new CatalogService(repo);});

describe('KV CatalogService',()=>{
  it('creates draft then publishes it without frontend rebuild',async()=>{const created=await service.upsertProduct(product,'owner@test');expect((await service.listPublic()).products).toHaveLength(0);await service.setStatus(created.id,'published','owner@test');expect((await service.listPublic()).products[0].slug).toBe('top-alba');});
  it('updates a published product and public reads return fresh title and price',async()=>{const created=await service.upsertProduct({...product,status:'published'},'owner@test');await service.updateProduct(created.id,{...product,status:'published',title:'Top Alba Editado',priceCents:3290000},'owner@test');expect(await service.getPublicBySlug('top-alba')).toMatchObject({title:'Top Alba Editado',priceCents:3290000});});
  it('archives product out of public catalog',async()=>{const created=await service.upsertProduct({...product,status:'published'},'owner@test');await service.setStatus(created.id,'archived','owner@test');expect((await service.listPublic()).products).toHaveLength(0);});
  it('dry-run mutates nothing and repeat import is idempotent with one final state write',async()=>{const importer=new ImportService(repo,service),rows=[{...product,status:'published',source:'json' as const}];const preview=await importer.preview(rows,'fixture.json','json');expect(preview.counts.create).toBe(1);expect(store.puts).toBe(0);const first=await importer.apply(rows,'fixture.json','json','owner@test');const putsAfterFirst=store.puts;const second=await importer.apply(rows,'fixture.json','json','owner@test');expect(first.counts.create).toBe(1);expect(second.counts.skip).toBe(1);expect((await service.listAdmin()).products).toHaveLength(1);expect(putsAfterFirst).toBe(1);expect(store.puts).toBe(1);});
  it('persists settings and preserves null production WhatsApp',async()=>{await service.updateSettings({storeName:'REBECA',instagramUrl:'https://www.instagram.com/rebeca_santafee/',whatsappNumber:null,deliveryLabel:'Coordinar envío',pickupLabel:'Retiro',demoMode:true},'owner@test');expect(await service.getSettings()).toMatchObject({whatsappNumber:null,demoMode:true,catalogRevision:1});});
  it('export validates as canonical data',async()=>{await service.upsertProduct(product,'owner@test');expect((await service.exportCanonical())[0].slug).toBe(product.slug);});
  it('rejects corrupted canonical state instead of silently resetting',async()=>{await store.put(STORE_STATE_KEY,JSON.stringify({schemaVersion:1,products:'bad'}));await expect(repo.read()).rejects.toThrow('store_state_invalid_schema');});
  it('maps KV write throttling to stable write_rate_limited',async()=>{store.failNextPut=new Error('429 too many writes');await expect(service.upsertProduct(product,'owner@test')).rejects.toBeInstanceOf(StoreWriteRateLimitedError);});
  it('writes schema-valid canonical state',async()=>{await service.upsertProduct(product,'owner@test');const raw=await store.get(STORE_STATE_KEY);expect(storeStateSchema.safeParse(JSON.parse(String(raw))).success).toBe(true);});
});
