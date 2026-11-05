import {safeUrl} from './geo';

/** Exact, source-checked correction; never rewrite unrelated brands or venues.
 * Verified 2026-11-04: official page names PARADISE TOKYO and its Higashiyama address.
 * https://cdn.wackomaria.co.jp/paradisetokyo
 * The Qloo-supplied root returned HTTP 403. Keep the raw website in saved/API data.
 */
export function venueWebsite(place: {name:string; website:string|null}):string|null {
  const url=safeUrl(place.website);
  if(!url)return null;
  const host=new URL(url).hostname.toLowerCase();
  if((host==='wackomaria.co.jp'||host==='www.wackomaria.co.jp') && /paradise\s+tokyo/i.test(place.name))
    return 'https://cdn.wackomaria.co.jp/paradisetokyo';
  return url;
}
