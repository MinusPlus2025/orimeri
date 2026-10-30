import {NextRequest,NextResponse} from 'next/server';
import {resolveTaste,discover} from '@/lib/agent';
import {guard,errorResponse} from '@/lib/http';
import {ServiceError} from '@/lib/qloo';
import type {Investigation} from '@/lib/types';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=60;
let cached:{until:number;result:Investigation}|undefined;let pending:Promise<Investigation>|undefined;
const references=[['Brian Eno','artist'],['The Little Prince','book'],['In the Mood for Love','movie'],['Dieter Rams','person'],['Aesop','brand']];
export async function GET(req:NextRequest){try{guard(req);if(cached&&cached.until>Date.now())return NextResponse.json({ok:true,result:cached.result},{headers:{'Cache-Control':'private, no-store'}});
 if(!pending)pending=(async()=>{const signal=AbortSignal.timeout(55000);const taste=await Promise.all(references.map(async([query,type])=>{const options=await resolveTaste(query,signal);const selected=options.find(x=>x.name.toLowerCase()===query.toLowerCase()&&x.type===`urn:entity:${type}`);if(!selected)throw new ServiceError('TASTE_STALE',`Could not resolve ${query}; preview was not fabricated.`,422);return selected;}));const result=await discover({taste,moment:'A cafe for quiet reading, with a little everyday life around me, within 5 km of Shibuya in Tokyo. No bars tonight.',areaId:'tokyo',radiusM:5000,excludeIds:[],locale:'en'},signal);cached={until:Date.now()+300000,result};return result;})().finally(()=>{pending=undefined;});
 return NextResponse.json({ok:true,result:await pending},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return errorResponse(e);}}
