import 'server-only';
import {randomUUID} from 'node:crypto';
import {unverifiedNeeds} from './evidence';
import {prioritizeRequestedCategory} from './proposal-order';
import {parseIntent} from './deepseek';
import {qloo,entities,searchTags,searchEntities,ServiceError,type Entity} from './qloo';
import {resolveArea,coordinates,distanceM,safeUrl} from './geo';
import type {DiscoverInput,Investigation,Place,Taste} from './types';
export async function resolveTaste(query:string,signal?:AbortSignal):Promise<Taste[]>{
 return (await searchEntities(query,signal)).filter(e=>e.entity_id&&e.name).map(e=>({entityId:e.entity_id!,name:e.name!,type:e.types?.[0]??e.type??'Cultural entity',query,image:safeUrl((e.properties?.image as {url?:string}|undefined)?.url??(e.properties?.images as {url?:string}[]|undefined)?.[0]?.url)}));
}
export async function discover(input:DiscoverInput,signal?:AbortSignal):Promise<Investigation>{
 if(input.challenge?.condition==='conditionAtmosphere')throw new ServiceError('CONDITION_UNVERIFIABLE','Qloo cannot verify current atmosphere, availability or opening hours. The original proposal was kept.',422);
 const area=resolveArea(input.areaId);if(!area)throw new ServiceError('INVALID_INPUT','Choose a valid search center.',400);
 const steps:Investigation['steps']=[],notices:string[]=[];
 // Revalidate client-selected IDs against server results; no fabricated or stale IDs enter signals.
 const canonical:Taste[]=[];for(const t of input.taste){const candidates=await resolveTaste(t.query,signal);const match=candidates.find(c=>c.entityId===t.entityId);if(!match)throw new ServiceError('TASTE_STALE',`Please resolve “${t.name}” again. Its selected identity could not be verified.`,422);canonical.push(match);}
 input={...input,taste:canonical};
 steps.push({label:'Taste held constant',detail:`${input.taste.length} selected Qloo identities verified. No preferences inferred from this moment.`});
 const plan=await parseIntent(input.moment,`${area.name}, ${area.city}`,input.challenge?.text,signal,input.locale,input.challenge?.previousQuestions);
 if(plan.locationMismatch)throw new ServiceError('AREA_MISMATCH','Your moment names a different city. Change the search area before investigating.',422);
 steps.push({label:'Moment interpreted',detail:plan.summary});
 async function resolveTags(words:string[],required:boolean){
  const out:{id:string;name:string}[]=[];
  for(const word of words){const all=await searchTags(word,signal);const exact=all.find(t=>t.name.toLowerCase().replace(/[_-]/g,' ')===word.toLowerCase().replace(/[_-]/g,' '));
   if(exact)out.push(exact);else if(all.length===1)out.push(all[0]);else if(required)throw new ServiceError('FILTER_UNRESOLVED',`The category “${word}” could not be resolved unambiguously. Try a concrete category such as café, gallery or book store.`,422);else notices.push(`No unambiguous Qloo tag for “${word}”; this category was not applied.`);
  }return out;
 }
 const included=await resolveTags(plan.categories,true),excluded=await resolveTags(plan.avoid,true);
 steps.push({label:'Constraints resolved',detail:`Categories: ${included.map(t=>t.name).join(', ')||'open'}. Excluded: ${excluded.map(t=>t.name).join(', ')||'none'}. Other needs remain unverified.`});
 const excludedIds=[...new Set([...input.excludeIds,...(input.challenge?[input.challenge.targetId]:[])])];
 const params:Record<string,string|undefined>={'filter.type':'urn:entity:place','filter.location':`POINT(${area.lon} ${area.lat})`,'filter.location.radius':String(input.radiusM),'signal.interests.entities':input.taste.map(t=>t.entityId).join(','),'filter.tags':included.map(t=>t.id).join(','),'operator.filter.tags':'union','filter.exclude.tags':excluded.map(t=>t.id).join(','),'filter.exclude.entities':excludedIds.join(','),'feature.explainability':'true',take:'20'};
 const raw=entities(await qloo('/v2/insights',params,signal));
 let rejected=0;const seen=new Set<string>();
 const places:Place[]=[];
 for(const e of raw){const c=coordinates(e as Record<string,unknown>);if(e.properties?.is_closed===true||!e.entity_id||!e.name||!c||distanceM(area,c)>input.radiusM||excludedIds.includes(e.entity_id)){rejected++;continue;}if(seen.has(e.entity_id))continue;seen.add(e.entity_id);
  const p=e.properties??{},dist=distanceM(area,c);
  const tags=e.tags??[];
  const tagIds=tags.map(t=>t.id);if(included.length&&!included.some(t=>tagIds.includes(t.id))||excluded.some(t=>tagIds.includes(t.id))){rejected++;continue;}
  const ev:Place['evidence']=[{source:'Qloo',label:'Cultural signal',detail:`Returned by Qloo Insights using ${input.taste.map(t=>t.name).join(', ')}. This is a collective recommendation, not proof of a causal link to one taste.`},{source:'Geometry',label:'Within your boundary',detail:`${(dist/1000).toFixed(2)} km straight-line from ${area.name}; verified against the ${input.radiusM/1000} km limit.`}];
  if(tags.length)ev.push({source:'Qloo',label:'Listed categories',detail:[...included.filter(t=>tagIds.includes(t.id)).map(t=>t.name),...tags.filter(t=>t.id?.includes('genre:place')).map(t=>t.name||t.id)].filter((v,i,a)=>a.indexOf(v)===i).slice(0,6).join(' · ')});
  const explain=e.query?.explainability;
  if(explain&&typeof explain==='object'){
   const contributions=(explain as Record<string,unknown>)['signal.interests.entities'];
   if(Array.isArray(contributions))for(const v of contributions){const t=input.taste.find(t=>t.entityId===v.entity_id);if(t&&typeof v.score==='number'&&v.score>=0&&v.score<=1)ev.push({source:'Qloo',label:t.name,detail:`Qloo reports an input contribution of ${v.score.toFixed(2)} on its normalized 0–1 scale. This is not a probability that you will like the place.`});}
  }
  const affinity=typeof e.query?.affinity==='number'?e.query.affinity:null;
  places.push({checks:{categories:included.filter(t=>tagIds.includes(t.id)).map(t=>t.name),excludedCategories:excluded.map(t=>t.name),radiusM:input.radiusM,origin:area.name},language:input.locale??'en',id:e.entity_id,name:e.name,address:typeof p.address==='string'?p.address:null,category:(p.primary_genre as {name?:string}|undefined)?.name??tags.find(t=>t.id?.includes('genre:place'))?.name??'Place',...c,distanceM:Math.round(dist),image:safeUrl((p.image as {url?:string}|undefined)?.url??(p.images as {url?:string}[]|undefined)?.[0]?.url),website:safeUrl(p.website),affinity,evidence:ev,unknowns:[...new Set([...unverifiedNeeds(plan.unknowns,area,input.radiusM),'Current opening hours, availability and on-site atmosphere have not been checked.',...(!explain?['No per-taste attribution was returned.']:[])])]});
 }
 steps.push({label:'Qloo investigated',detail:`${raw.length} candidates received; ${rejected} rejected by identity, exclusion or coordinate checks. Boundary was not widened.`});
 if(!places.length)notices.push('No verified places met this boundary and category combination. Edit the moment or explicitly widen the radius; no substitute places were invented.');
 return {id:randomUUID(),at:new Date().toISOString(),input:input.moment,taste:input.taste,area,radiusM:input.radiusM,plan,places:prioritizeRequestedCategory(places,included.map(t=>t.name)).slice(0,input.challenge?1:3),steps,notices,live:true};
}
