const base=(process.env.REBECA_RELEASE_URL??'https://rebeca-sf.simondalmasso44.workers.dev').replace(/\/$/,'');
const expectedSha=process.env.CI_COMMIT_SHA;
if(!expectedSha)throw new Error('CI_COMMIT_SHA is required');
async function get(path){const response=await fetch(base+path,{headers:{'cache-control':'no-cache'}});if(!response.ok)throw new Error(path+' returned '+response.status);return response;}
const health=await (await get('/api/health')).json();
if(health.sha!==expectedSha)throw new Error('health sha mismatch: '+health.sha+' != '+expectedSha);
if(health.storage!=='kv'||health.store!=='ok'||health.media!=='ok')throw new Error('KV health not ready');
const home=await get('/');if(!(home.headers.get('content-type')??'').includes('text/html'))throw new Error('home is not HTML');
const catalog=await (await get('/api/catalog')).json();if(!Array.isArray(catalog.products)||catalog.products.length!==14)throw new Error('catalog expected 14 published demo products, got '+(catalog.products?.length??'invalid'));
console.log(JSON.stringify({base,sha:health.sha,storage:health.storage,store:health.store,media:health.media,catalogProducts:catalog.products.length,smoke:'PASS'}));
