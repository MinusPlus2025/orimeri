import {test,expect} from '@playwright/test';
for(const width of [1440,390])test(`taste navigation and editor at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:844});
 await page.addInitScript(()=>localStorage.setItem('orimeri.taste.v1',JSON.stringify([{entityId:'11111111-1111-4111-8111-111111111111',name:'Test artist',query:'Test artist',type:'urn:entity:artist'}])));
 await page.route('**/api/examples',r=>r.fulfill({json:{ok:true,examples:[]}}));
 await page.goto('/');await page.locator('#moment').fill('Keep this request');
 await expect(page.locator('#taste-query')).toHaveCount(0);
 await page.locator('.living-nav button').nth(1).click();
 await expect(page.locator('#taste-collection')).toBeFocused();
 await expect(page.locator('#taste-query')).toBeVisible();
 await page.locator('.collection-heading button').click();
 await expect(page.locator('#taste-query')).toHaveCount(0);
 await page.locator('.collection-add').click();await expect(page.locator('#taste-query')).toBeFocused();
 await expect(page.locator('#moment')).toHaveValue('Keep this request');
 for(const language of ['简体中文','日本語','English']){await page.getByRole('button',{name:language,exact:true}).click();await expect(page.locator('#moment')).toHaveValue('Keep this request');}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`artifacts/taste-navigation-${width}.png`,fullPage:true});
});
