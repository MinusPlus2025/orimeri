import {test,expect} from '@playwright/test';
for(const width of [390,1440])test(`location confirmation and state preservation ${width}`,async({page,context})=>{
 await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:22.3193,longitude:114.1694,accuracy:30});
 await page.setViewportSize({width,height:900});await page.route('**/api/examples',r=>r.fulfill({json:{ok:true,examples:[]}}));
 await page.goto('/');await page.locator('#moment').fill('Read near this location');
 await page.getByRole('button',{name:'Near me',exact:true}).click();await expect(page.getByRole('button',{name:'Use this search center',exact:true})).toBeVisible();
 await expect(page.locator('#area')).toHaveValue('tokyo');
 await page.getByRole('button',{name:'Use this search center',exact:true}).click();await expect(page.locator('#area')).toHaveValue('nearby:22.319300,114.169400');
 for(const language of ['简体中文','日本語','English']){await page.getByRole('button',{name:language,exact:true}).click();await expect(page.locator('#moment')).toHaveValue('Read near this location');await expect(page.locator('#area')).toHaveValue('nearby:22.319300,114.169400');}
 await page.screenshot({path:`artifacts/location-${width}.png`,fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.setGeolocation({latitude:22,longitude:114,accuracy:5000});await page.getByRole('button',{name:'Near me',exact:true}).click();await expect(page.locator('.area-picker [role=alert]')).toContainText('too approximate');await expect(page.locator('#area')).toHaveValue('nearby:22.319300,114.169400');
});
