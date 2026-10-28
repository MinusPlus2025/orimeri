import 'server-only';
import {NextRequest,NextResponse} from 'next/server';
import {ServiceError} from './qloo';
const hits=new Map<string,{count:number;until:number}>();
export function guard(req:NextRequest){
 const origin=req.headers.get('origin');if(origin&&origin!==req.nextUrl.origin&&origin!==`https://${req.headers.get('host')}`&&!( /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.get('host')||'')&&origin===`http://${req.headers.get('host')}`))throw new ServiceError('ORIGIN','This request must come from this application.',403);
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]??'local';const bucket=`${ip}:${req.nextUrl.pathname}`;const now=Date.now();const hit=hits.get(bucket);
 if(hit&&hit.until>now){if(hit.count>=20)throw new ServiceError('RATE_LIMIT','Too many investigations. Please wait a minute.',429);hit.count++;}else hits.set(bucket,{count:1,until:now+60000});
 if(hits.size>1000)for(const[k,v]of hits)if(v.until<now)hits.delete(k);
}
export async function readBody(req:NextRequest){if(Number(req.headers.get('content-length')||0)>16000)throw new ServiceError('INPUT_TOO_LARGE','This request is too long.',413);const t=await req.text();if(t.length>16000)throw new ServiceError('INPUT_TOO_LARGE','This request is too long.',413);try{return JSON.parse(t);}catch{throw new ServiceError('INVALID_JSON','Please submit a valid request.',400);}}
export function errorResponse(e:unknown){const known=e instanceof ServiceError;return NextResponse.json({ok:false,live:false,code:known?e.code:'INTERNAL',message:known?e.message:'The investigation failed. Your space is unchanged; please retry.'},{status:known?e.status:500,headers:{'Cache-Control':'no-store'}});}
