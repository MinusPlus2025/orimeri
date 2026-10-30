import type {Area} from './types';
// Remove only exact restatements of geometry already checked by the server.
// Mixed claims (quietness, walking time, access, etc.) are deliberately retained.
export function unverifiedNeeds(needs:string[],area:Area,radiusM:number):string[]{
 const normalize=(s:string)=>s.toLowerCase().replace(/[.,。]/g,'').replace(/\s+/g,' ').trim();
 const km=radiusM/1000;
 const verified=new Set([`within ${km} km of ${area.name}`,`within ${km}km of ${area.name}`,`within ${km} km from ${area.name}`,`within ${km} km`,`${km} km radius`,`${area.name}から${km}km以内`,`${area.name}周边${km}公里内`].map(normalize));
 return needs.filter(n=>!verified.has(normalize(n)));
}
