import fs from 'node:fs';import path from 'node:path';
const entries=['src','public','package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts'];
const walk=p=>fs.statSync(p).isDirectory()?fs.readdirSync(p).flatMap(n=>walk(path.join(p,n))):[p];
const files=entries.filter(p=>fs.existsSync(p)).flatMap(walk).map(file=>({file,data:fs.readFileSync(file).toString('base64'),encoding:'base64'}));
process.stdout.write(JSON.stringify(files));
