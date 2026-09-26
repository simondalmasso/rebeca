export class TestKv {
  readonly map=new Map<string,{value:string|ArrayBuffer;metadata?:unknown}>();
  puts=0;
  failNextPut:Error|null=null;
  asNamespace(){return this as unknown as KVNamespace;}
  async get(key:string,type?:string){const item=this.map.get(key);if(!item)return null;if(type==='arrayBuffer')return typeof item.value==='string'?new TextEncoder().encode(item.value).buffer:item.value;if(type==='json'){const text=typeof item.value==='string'?item.value:new TextDecoder().decode(item.value);return JSON.parse(text);}return typeof item.value==='string'?item.value:new TextDecoder().decode(item.value);}
  async put(key:string,value:string|ArrayBuffer|ArrayBufferView,options?:{metadata?:unknown}){this.puts++;if(this.failNextPut){const error=this.failNextPut;this.failNextPut=null;throw error;}const stored=typeof value==='string'?value:value instanceof ArrayBuffer?value:new Uint8Array(value.buffer,value.byteOffset,value.byteLength).slice().buffer;this.map.set(key,{value:stored,metadata:options?.metadata});}
  async delete(key:string){this.map.delete(key);}
  async getWithMetadata(key:string,type?:string){const item=this.map.get(key);return{value:item?await this.get(key,type):null,metadata:item?.metadata??null,cacheStatus:null};}
}
