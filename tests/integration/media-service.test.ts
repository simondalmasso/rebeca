import { beforeEach,describe,expect,it } from 'vitest';
import { MediaService } from '../../worker/services/media-service';
import { CatalogService } from '../../worker/services/catalog-service';
import { KvStoreRepository } from '../../worker/repositories/store-repository';
import { TestKv } from './kv-shim';

let store:TestKv,mediaKv:TestKv,repo:KvStoreRepository,service:CatalogService;
const png=new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0]).buffer;
beforeEach(()=>{store=new TestKv();mediaKv=new TestKv();repo=new KvStoreRepository(store.asNamespace(),{bootstrapIfMissing:true});service=new CatalogService(repo);});
async function makeProduct(slug='media-test'){return service.upsertProduct({slug,title:'Media',description:'',priceCents:100,currency:'ARS',status:'published',featured:false,variants:[{availability:'available',active:true}],source:'manual',demoData:false},'owner@test');}

describe('KV MediaService',()=>{
  it('writes original and derivatives to MEDIA_KV metadata then deletes them',async()=>{const p=await makeProduct();const media=new MediaService(repo,mediaKv.asNamespace());const r=await media.upload(p.id,{original:{data:png,type:'image/png'},small:{data:png,type:'image/png'},large:{data:png,type:'image/png'},altText:'Prenda demo',width:800,height:1000},'owner@test');expect(mediaKv.map.size).toBe(3);expect([...mediaKv.map.keys()]).toContain(r.originalKey);expect((await service.getPublicBySlug('media-test'))?.media[0].id).toBe(r.id);expect(mediaKv.map.get(r.originalKey)?.metadata).toMatchObject({contentType:'image/png'});await media.remove(r.id,'owner@test');expect(mediaKv.map.size).toBe(0);expect((await service.getPublicBySlug('media-test'))?.media).toHaveLength(0);});
  it('reorders media metadata without rewriting binary objects',async()=>{const p=await makeProduct('order-test');const media=new MediaService(repo,mediaKv.asNamespace());const a=await media.upload(p.id,{original:{data:png,type:'image/png'},altText:'A',width:800,height:1000},'owner@test');const b=await media.upload(p.id,{original:{data:png,type:'image/png'},altText:'B',width:800,height:1000},'owner@test');const before=mediaKv.puts;await media.reorder(p.id,[b.id,a.id],'owner@test');expect(mediaKv.puts).toBe(before);expect((await service.getPublicBySlug('order-test'))?.media.map(m=>m.id)).toEqual([b.id,a.id]);});
  it('rejects SVG and invalid signatures',async()=>{const p=await makeProduct('bad-media');const media=new MediaService(repo,mediaKv.asNamespace());await expect(media.upload(p.id,{original:{data:new TextEncoder().encode('<svg/>').buffer,type:'image/svg+xml'},altText:'x',width:10,height:10},'owner@test')).rejects.toThrow('unsupported_image_type');await expect(media.upload(p.id,{original:{data:new Uint8Array([1,2,3,4]).buffer,type:'image/png'},altText:'x',width:10,height:10},'owner@test')).rejects.toThrow('invalid_image_signature');});
});
