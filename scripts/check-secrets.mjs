import fs from 'node:fs';import path from 'node:path';import cp from 'node:child_process';import env from '@next/env';env.loadEnvConfig(process.cwd());
const secrets=['QLOO_API_KEY','DEEPSEEK_API_KEY'].map(k=>process.env[k]).filter(v=>v&&v.length>8);
const tracked=cp.execFileSync('git',['ls-files','-z']).toString().split('\0').filter(Boolean);
const walk=d=>fs.existsSync(d)?fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]):[];
const targets=[...tracked,...walk('.next/static')];let failed=[];for(const file of targets){if(!fs.existsSync(file))continue;const s=fs.readFileSync(file).toString();if(secrets.some(v=>s.includes(v)))failed.push(file);}
if(failed.length){console.error('Secret found in:',failed);process.exit(1);}console.log(JSON.stringify({filesChecked:targets.length,secretValuesInTrackedOrBrowserFiles:0,envTracked:tracked.some(p=>p==='.env.local')}));
