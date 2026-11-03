// Synthetic routed responses use the production schema; they are not live API evidence.
import {test,expect} from '@playwright/test';
const taste={entityId:'11111111-1111-4111-8111-111111111111',name:'Synthetic artist',query:'Synthetic artist',type:'urn:entity:artist'};
const place={checks:{categories:['Cafe'],excludedCategories:['Bar'],radiusM:5000,origin:'Shibuya'},id:'original',name:'Synthetic original',address:null,category:'Cafe',lat:35.66,lon:139.70,distanceM:100,image:null,website:null,affinity:null,evidence:[],unknowns:['Unverified quietness'],language:'en'};
const result={id:'fixture',at:'2026-11-01T00:00:00Z',input:'Synthetic reading',taste:[taste],area:{id:'tokyo',name:'Shibuya',city:'Tokyo',lat:35.6595,lon:139.7005},radiusM:5000,plan:{summary:'Synthetic explanation',categories:[],avoid:[],unknowns:[],locationMismatch:false},places:[place],steps:[],notices:[],live:true};
for(const width of [1440,390])test(`decision preview, discard, adopt, undo and locale at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.addInitScript(t=>localStorage.setItem('orimeri.taste.v1',JSON.stringify([t])),taste);
 await page.route('**/api/examples',r=>r.fulfill({json:{ok:true,examples:[]}}));await page.route('**/api/translate',r=>r.fulfill({json:{ok:true,texts:['Synthetic translated explanation']}}));let calls=0;
 await page.route('**/api/discover',r=>{calls++;return r.fulfill({json:{ok:true,result:calls===1?result:{...result,id:'replacement-fixture',places:[{...place,id:'replacement',name:'Synthetic bookstore',category:'Book store',checks:{categories:['Book store'],excludedCategories:['Restaurant'],radiusM:2000,origin:'Shibuya'}}]}}});});
 await page.goto('/');await page.locator('#moment').fill(result.input);await page.getByTestId('explore').click();await expect(page.locator('.photograph-caption h1')).toHaveText(place.name);
 await page.locator('.proposal-actions button').first().click();await expect(page.locator('.capability-note')).toContainText('cannot verify');await expect(page.locator('.agent-reading')).toBeVisible();await expect(page.locator('.uncertainty-area>h2')).toBeVisible();await expect(page.locator('.proposal-actions')).toContainText('Cafe');await page.screenshot({path:`artifacts/evidence-context-${width}.png`,fullPage:true});await expect(page.getByTestId('reinvestigate')).toHaveCount(0);await expect(page.locator('#challenge')).toHaveCount(0);expect(calls).toBe(1);
 await page.locator('.close-question').click();await expect(page.locator('.proposal-actions button').first()).toBeFocused();await page.locator('.proposal-actions button').nth(1).click();await expect(page.locator('#challenge')).toBeFocused();await page.keyboard.press('Escape');await expect(page.locator('#proposal-question')).toHaveCount(0);await expect(page.locator('.proposal-actions button').nth(1)).toBeFocused();await page.locator('.proposal-actions button').nth(1).click();await page.locator('#challenge').fill('A bookstore instead');await page.getByTestId('reinvestigate').click();await expect(page.locator('.revision-preview')).toContainText('Synthetic bookstore');await expect(page.locator('.photograph-caption h1')).toHaveText(place.name);await expect(page.getByTestId('undo')).toBeDisabled();
 await page.getByTestId('discard-revision').click();await expect(page.locator('.revision-preview')).toHaveCount(0);await expect(page.locator('.photograph-caption h1')).toHaveText(place.name);
 await page.getByTestId('reinvestigate').click();await expect(page.getByTestId('apply-revision')).toBeVisible();
 for(const lang of ['简体中文','日本語','English']){await page.getByRole('button',{name:lang,exact:true}).click();await expect(page.locator('#challenge')).toHaveValue('A bookstore instead');await expect(page.locator('.revision-preview')).toContainText('Synthetic bookstore');}
 await expect(page.locator('.revision-pair article')).toHaveCount(2);await expect(page.locator('.preserved-taste')).toContainText('Synthetic artist');expect(await page.locator('.revision-pair').evaluate(el=>el.getBoundingClientRect().bottom<=el.parentElement!.querySelector('.preserved-taste')!.getBoundingClientRect().top)).toBe(true);await page.locator('.revision-preview').scrollIntoViewIfNeeded();await page.screenshot({path:`artifacts/decision-preview-${width}.png`,fullPage:false});
 await page.getByTestId('apply-revision').click();await expect(page.locator('.photograph-caption h1')).toHaveText('Synthetic bookstore');await expect(page.locator('.cultural-rationale .proposal-checks')).toContainText('Book store');await expect(page.locator('.cultural-rationale .proposal-checks')).toContainText('0.10 km · within a limit of 2 km');await expect(page.getByTestId('taste-count')).toHaveText('1/6');await page.getByRole('button',{name:'Save this moment',exact:true}).click();await page.reload();await page.getByRole('button',{name:/^Saved moments/}).click();await page.locator('.saved-row').getByRole('button',{name:'Open',exact:true}).click();await expect(page.locator('.photograph-caption h1')).toHaveText('Synthetic bookstore');await expect(page.locator('.cultural-rationale .proposal-checks')).toContainText('Book store');await page.getByTestId('undo').click();await expect(page.locator('.cultural-rationale .proposal-checks')).toContainText('Cafe');await expect(page.locator('.cultural-rationale .proposal-checks')).toContainText('0.10 km · within a limit of 5 km');await expect(page.locator('.photograph-caption h1')).toHaveText(place.name);expect(calls).toBe(3);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

for(const failure of ['QLOO_AUTH','UPSTREAM_TIMEOUT'])test(`failed revision preserves the proposal and can retry: ${failure}`,async({page})=>{
 await page.addInitScript(t=>localStorage.setItem('orimeri.taste.v1',JSON.stringify([t])),taste);
 await page.route('**/api/examples',r=>r.fulfill({json:{ok:true,examples:[]}}));let calls=0;
 await page.route('**/api/discover',r=>{calls++;return calls===2?r.fulfill({status:503,json:{ok:false,code:failure}}):r.fulfill({json:{ok:true,result}});});
 await page.goto('/');await page.locator('#moment').fill(result.input);await page.getByTestId('explore').click();await expect(page.locator('.photograph-caption h1')).toHaveText(place.name);
 await page.locator('.proposal-actions button').nth(1).click();await page.locator('#challenge').fill('A bookstore instead');await page.getByTestId('reinvestigate').click();await expect(page.locator('.question-response')).toBeVisible();await expect(page.locator('.photograph-caption h1')).toHaveText(place.name);await expect(page.locator('#challenge')).toHaveValue('A bookstore instead');await expect(page.getByTestId('taste-count')).toHaveText('1/6');await expect(page.getByTestId('undo')).toBeDisabled();
 await page.locator('.question-response').getByRole('button',{name:'Retry',exact:true}).click();await expect(page.locator('.revision-preview')).toBeVisible();expect(calls).toBe(3);
});

for(const width of [1440,390])test(`source resolution, action gaps and pointer feedback at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});
 await page.route('**/fixture-image.svg',r=>r.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160"><rect width="240" height="160" fill="#dce6e9"/><text x="20" y="80">TEST IMAGE 240px</text></svg>'}));
 const illustrated={...taste,image:'/fixture-image.svg'};
 await page.addInitScript(t=>localStorage.setItem('orimeri.taste.v1',JSON.stringify([t])),illustrated);
 await page.route('**/api/examples',r=>r.fulfill({json:{ok:true,examples:[]}}));
 await page.route('**/api/discover',r=>r.fulfill({json:{ok:true,result:{...result,taste:[illustrated],places:[{...place,image:'/fixture-image.svg'}]}}}));
 await page.goto('/');await page.locator('#moment').fill(result.input);await page.getByTestId('explore').click();
 const image=page.locator('.place-photograph>img');await expect(image).toHaveAttribute('data-compact','true');expect((await image.boundingBox())!.width).toBeLessThanOrEqual(240);
 expect(await page.locator('.proposal-actions').evaluate(el=>parseFloat(getComputedStyle(el).gap))).toBeGreaterThanOrEqual(10);
 const control=page.locator('.linked-tastes button').first();await control.scrollIntoViewIfNeeded();const box=(await control.boundingBox())!;
 await page.mouse.move(box.x+box.width*.8,box.y+box.height*.7);
 await expect.poll(()=>control.evaluate(el=>el.style.getPropertyValue('--pointer-x'))).not.toBe('');
 await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(()=>control.evaluate(el=>el.style.getPropertyValue('--pointer-x'))).toBe('');
 await image.scrollIntoViewIfNeeded();await page.screenshot({path:`artifacts/source-spacing-${width}.png`,fullPage:false});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
