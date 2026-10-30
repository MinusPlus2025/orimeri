import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const base=process.env.BASE_URL||'http://127.0.0.1:3120';
const dir=process.env.AUDIT_DIR||'artifacts/audit';await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:dir+'/video',size:{width:1440,height:900}}});
const page=await context.newPage();const errors=[],requests=[],failures=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/api/'))requests.push({path:new URL(r.url()).pathname,method:r.method()})});page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));
const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');
await page.goto(base);await page.getByTestId('use-example').click();await page.getByRole('button',{name:'Deselect Brian Eno',exact:true}).waitFor({timeout:30000});
await page.locator('#moment').fill('A cafe for quiet reading, with some everyday life, within 5 km of Shibuya in Tokyo. No bars tonight.');
const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/discover')&&r.request().method()==='POST',{timeout:65000});await page.getByTestId('explore').click();const response=await responsePromise;const body=await response.json();await fs.writeFile(dir+'/live-response.private.json',JSON.stringify({status:response.status(),body},null,2));if(!body.ok||!body.result.places.length)throw new Error('Real query did not return candidates: '+body.code);
await page.locator('.photograph-caption h1').waitFor();await page.waitForTimeout(2000);
const scans=[];for(const [name,width,height]of [['desktop',1440,900],['tablet',768,1024],['mobile',390,844]]){await page.setViewportSize({width,height});await page.screenshot({path:dir+'/'+name+'.png',fullPage:true});const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();await fs.writeFile(dir+'/axe-live-'+name+'.json',JSON.stringify(axe,null,2));scans.push({name,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),violations:axe.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length}))});}
await page.setViewportSize({width:1440,height:900});await page.locator('.source-evidence summary').focus();await page.keyboard.press('Enter');if(await page.locator('.source-evidence').getAttribute('open')===null)throw Error('Evidence keyboard toggle failed');
await page.locator('.uncertain-claims button').first().click();await page.locator('#challenge').fill('Is this quiet right now?');const questionResponse=page.waitForResponse(r=>r.url().endsWith('/api/discover')&&r.request().method()==='POST',{timeout:65000});await page.getByTestId('reinvestigate').click();const question=await(await questionResponse).json();await page.screenshot({path:dir+'/question.png',fullPage:true});
const before=requests.length;for(const lang of ['简体中文','日本語','English','简体中文']){await page.getByRole('button',{name:lang,exact:true}).click();await page.waitForTimeout(250);await page.waitForFunction(()=>!document.querySelector('.uncertainty-area')?.textContent?.match(/Translating the explanation|正在翻译|翻訳中/),{},{timeout:25000});}
const languageRequests=requests.slice(before);const performance=await cdp.send('Performance.getMetrics');
await fs.writeFile(dir+'/browser-observations.json',JSON.stringify({base,status:response.status(),id:body.result.id,places:body.result.places.map(p=>({id:p.id,name:p.name,distanceM:p.distanceM})),question,scans,errors,failures,languageRequests,performance},null,2));
await context.close();await browser.close();console.log(JSON.stringify({status:response.status(),scans,errors,languageRequests,question:question.code}));
