import { readFile } from 'node:fs/promises';

const base=process.env.REBECA_LOCAL_URL ?? 'http://127.0.0.1:8787';
const products=JSON.parse(await readFile(new URL('../data/demo-catalog.json',import.meta.url),'utf8'));
const headers={'x-test-admin':'1',Origin:base,'content-type':'application/json'};

for(const product of products){
  const response=await fetch(`${base}/api/admin/products`,{method:'POST',headers,body:JSON.stringify(product)});
  if(!response.ok) throw new Error(`seed ${product.slug}: ${response.status} ${await response.text()}`);
}
const settings=await fetch(`${base}/api/admin/settings`,{method:'PUT',headers,body:JSON.stringify({storeName:'REBECA',instagramUrl:'https://www.instagram.com/rebeca_santafee/',whatsappNumber:'+5493420000000',deliveryLabel:'Coordinar envío',pickupLabel:'Retiro',demoMode:true})});
if(!settings.ok) throw new Error(`settings: ${settings.status} ${await settings.text()}`);
console.log(`SEEDED_DEMO=${products.length}`);
