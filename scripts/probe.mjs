import env from '@next/env'; const {loadEnvConfig}=env;
loadEnvConfig(process.cwd());
const url=new URL('https://hackathon.api.qloo.com/search');
url.searchParams.set('query','Brian Eno'); url.searchParams.set('take','2');
try {const r=await fetch(url,{headers:{'X-Api-Key':process.env.QLOO_API_KEY},signal:AbortSignal.timeout(20000)});const b=await r.json(); console.log(JSON.stringify({status:r.status,keys:Object.keys(b),sample:b.results?.[0]??b.results?.entities?.[0]??b.entities?.[0]??b},null,2).slice(0,7000));}catch(e){console.log(e.name,e.message)}
