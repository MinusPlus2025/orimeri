import {test,expect} from '@playwright/test';
// Synthetic entity only; layout/state tests do not claim live Qloo verification.
for(const width of [360,390,756])test(`mobile navigation and composition ${width}`,async({page})=>{
 await page.setViewportSize({width,height:844});
 await page.addInitScript(()=>localStorage.setItem('orimeri.taste.v1',JSON.stringify([{entityId:'11111111-1111-4111-8111-111111111111',name:'Test reference',query:'Test reference',type:'urn:entity:artist'}])));
 await page.route('**/api/examples',r=>r.fulfill({json:{ok:true,examples:[]}}));
 await page.goto('/');await page.locator('#moment').fill('Read for an hour. No bars tonight.');
 for(const [language,dark,light] of [['日本語','ダーク','ライト'],['简体中文','深色','浅色'],['English','Dark','Light']]){
 await page.getByRole('button',{name:language,exact:true}).click();
 for(const theme of [dark,light]){
 await page.getByRole('button',{name:theme,exact:true}).click();
 await expect(page.getByRole('button',{name:theme,exact:true})).toHaveAttribute('aria-pressed','true');
 await page.waitForTimeout(400); // Capture the settled theme, not the color transition.
 await expect(page.locator('#moment')).toHaveValue('Read for an hour. No bars tonight.');
 expect(await page.locator('.living-nav').evaluate(el=>getComputedStyle(el,'::after').borderRadius)).toBe('999px');
 const title=(await page.locator('.scene-heading').boundingBox())!,form=(await page.locator('.living-composer').boundingBox())!;
 await expect(page.locator('.scene-credit')).toHaveCount(0);expect(title.y+title.height).toBeLessThanOrEqual(form.y);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const nav=(await page.locator('.living-nav').boundingBox())!;
 expect(Math.abs(nav.y+nav.height-844)).toBeLessThanOrEqual(1);
 for(const button of await page.locator('.living-nav button').all()){
  const bounds=(await button.boundingBox())!;
  expect(bounds.height).toBeGreaterThanOrEqual(44);
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);
 }
 if(language==='日本語')await page.screenshot({path:`artifacts/mobile-layout-${width}-${theme===dark?'dark':'light'}.png`,fullPage:true});
 }
 }
 const buttons=page.locator('.living-nav button');
 await buttons.nth(1).click();await expect(buttons.nth(1)).toHaveAttribute('aria-current','page');
 await expect.poll(()=>page.locator('.living-nav').evaluate(el=>Math.round(new DOMMatrix(getComputedStyle(el,'::after').transform).m41))).toBe(Math.round((await buttons.nth(1).boundingBox())!.x-(await page.locator('.living-nav').boundingBox())!.x));
 await page.locator('.living-nav button').nth(2).click();await expect(page.locator('.personal-panel')).toBeVisible();await page.locator('.living-nav button').first().click();await expect(page.locator('#moment')).toHaveValue('Read for an hour. No bars tonight.');
});
