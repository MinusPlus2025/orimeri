import 'server-only';
export class ServiceError extends Error {
 constructor(public code:string,message:string,public status=502){super(message);this.name='ServiceError';}
}
export type Entity={entity_id?:string;name?:string;types?:string[];type?:string;properties?:Record<string,unknown>;location?:Record<string,unknown>;tags?:{id?:string;name?:string}[];query?:Record<string,unknown>};
const cache=new Map<string,{at:number;data:Record<string,unknown>}>();
export async function qloo(path:string,params:Record<string,string|undefined>,signal?:AbortSignal):Promise<Record<string,unknown>>{
 const key=process.env.QLOO_API_KEY;
 if(!key)throw new ServiceError('QLOO_NOT_CONFIGURED','Qloo is not configured. The operator needs to connect a valid API key.',503);
 const url=new URL(path,process.env.QLOO_API_BASE_URL||'https://hackathon.api.qloo.com');
 for(const [k,v] of Object.entries(params))if(v)url.searchParams.set(k,v);
 const hit=cache.get(url.href);if(hit&&Date.now()-hit.at<60000)return hit.data;
 for(let attempt=0;attempt<2;attempt++){
  let res:Response;
  try {res=await fetch(url,{headers:{'X-Api-Key':key,Accept:'application/json'},cache:'no-store',signal:AbortSignal.any([AbortSignal.timeout(15000),...(signal?[signal]:[])])});}
  catch {throw new ServiceError(signal?.aborted?'CANCELLED':'UPSTREAM_TIMEOUT','The data service did not respond in time. Your space is unchanged; please retry.',504);}
  if(res.status===429){if(attempt===0){await new Promise(r=>setTimeout(r,800));continue;}throw new ServiceError('QLOO_RATE_LIMIT','Qloo is temporarily rate limited. Wait a moment, then retry.',429);}
  if(res.status===401||res.status===403)throw new ServiceError('QLOO_AUTH','Qloo rejected the server credentials. The operator needs to check the API key.',503);
  if(!res.ok)throw new ServiceError('QLOO_REQUEST',`Qloo could not complete this request (HTTP ${res.status}). Your space is unchanged.`,502);
  let data:Record<string,unknown>;try {data=await res.json();}catch{throw new ServiceError('QLOO_RESPONSE','Qloo returned an unreadable response. Please retry.');}
  if(!data||typeof data!=='object'||data.success===false||data.error)throw new ServiceError('QLOO_RESPONSE','Qloo reported an unsuccessful response. Please retry.');
  if(cache.size>300)cache.delete(cache.keys().next().value!);
  cache.set(url.href,{at:Date.now(),data});return data;
 }
 throw new ServiceError('QLOO_REQUEST','Qloo is unavailable. Please retry.');
}
export function entities(data:Record<string,unknown>):Entity[]{
 const r=data.results;
 const a=Array.isArray(r)?r:(r as Record<string,unknown>|undefined)?.entities??data.entities;
 if(!Array.isArray(a))throw new ServiceError('QLOO_SCHEMA','Qloo returned an unexpected entity format. No recommendations were accepted.');
 return a.filter(e=>e&&typeof e==='object');
}
export async function searchEntities(query:string,signal?:AbortSignal){return entities(await qloo('/search',{query,take:'8',types:'urn:entity:artist,urn:entity:movie,urn:entity:book,urn:entity:brand,urn:entity:person,urn:entity:tv_show,urn:entity:podcast'},signal));}
export async function searchTags(query:string,signal?:AbortSignal):Promise<{id:string;name:string}[]>{
 const data=await qloo('/v2/tags',{'filter.query':query,'filter.parents.types':'urn:entity:place',take:'10'},signal);
 const r=data.results;const list=Array.isArray(r)?r:(r as Record<string,unknown>|undefined)?.tags??data.tags;
 if(!Array.isArray(list))throw new ServiceError('QLOO_SCHEMA','Qloo returned an unexpected tag format. No filters were guessed.');
 return list.filter(t=>typeof t?.id==='string'&&typeof t?.name==='string').map(t=>({id:t.id,name:t.name}));
}
