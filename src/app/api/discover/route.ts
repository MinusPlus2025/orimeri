import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {discover} from '@/lib/agent';
import {resolveArea} from '@/lib/geo';
import {ServiceError} from '@/lib/qloo';
import {guard,readBody,errorResponse} from '@/lib/http';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
const taste=z.object({entityId:z.string().uuid(),name:z.string().min(1).max(150),query:z.string().min(1).max(100),type:z.string().max(80)});
const schema=z.object({taste:z.array(taste).min(1).max(6),moment:z.string().trim().min(3).max(1000),areaId:z.string().max(100).refine(v=>!!resolveArea(v)),radiusM:z.union([z.literal(2000),z.literal(5000),z.literal(10000)]),excludeIds:z.array(z.string().uuid()).max(20).default([]),locale:z.enum(['en','zh','ja']).default('en'),challenge:z.object({previousQuestions:z.array(z.string().min(3).max(500)).max(12).optional(),condition:z.enum(['conditionCategory','conditionDistance','conditionCulture','conditionAtmosphere']).optional(),targetId:z.string().uuid(),text:z.string().trim().min(3).max(500)}).optional()});
export async function POST(req:NextRequest){try{guard(req);const parsed=schema.safeParse(await readBody(req));if(!parsed.success)throw new ServiceError('INVALID_INPUT','Choose at least one resolved taste, a search area and a moment (3–1,000 characters).',400);const result=await discover(parsed.data,AbortSignal.any([req.signal,AbortSignal.timeout(55000)]));return NextResponse.json({ok:true,result},{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function GET(){return NextResponse.json({configured:{qloo:Boolean(process.env.QLOO_API_KEY),language:Boolean(process.env.DEEPSEEK_API_KEY)},note:'Configuration is not proof of connectivity.'},{headers:{'Cache-Control':'no-store'}});}
