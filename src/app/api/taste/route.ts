import {NextRequest,NextResponse} from 'next/server';
import {resolveTaste} from '@/lib/agent';
import {guard,readBody,errorResponse} from '@/lib/http';
import {ServiceError} from '@/lib/qloo';
export const runtime='nodejs';export const maxDuration=30;
export async function POST(req:NextRequest){try{guard(req);const b=await readBody(req);if(typeof b?.query!=='string'||b.query.trim().length<2||b.query.length>100)throw new ServiceError('INVALID_INPUT','Enter a cultural name between 2 and 100 characters.',400);const candidates=await resolveTaste(b.query.trim(),req.signal);return NextResponse.json({ok:true,candidates},{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
