import type { Area } from './types';
export const AREAS: Area[] = [
 {id:'tokyo',name:'Shibuya',city:'Tokyo',lat:35.6595,lon:139.7005},
 {id:'new-york',name:'Lower Manhattan',city:'New York',lat:40.7241,lon:-73.9969},
 {id:'london',name:'Soho',city:'London',lat:51.5137,lon:-0.1337},
 {id:'paris',name:'Le Marais',city:'Paris',lat:48.8589,lon:2.3625},
 {id:'shanghai',name:"Jing'an",city:'Shanghai',lat:31.223,lon:121.445},
];
export function distanceM(a:{lat:number;lon:number},b:{lat:number;lon:number}) {
 const rad=Math.PI/180, dlat=(b.lat-a.lat)*rad,dlon=(b.lon-a.lon)*rad;
 const v=Math.sin(dlat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dlon/2)**2;
 return 6371008.8*2*Math.atan2(Math.sqrt(v),Math.sqrt(Math.max(0,1-v)));
}
export function coordinates(e:Record<string,unknown>):{lat:number;lon:number}|null {
 const loc=e.location as Record<string,unknown>|undefined;
 const p=e.properties as Record<string,unknown>|undefined;
 const geo=p?.geocode as Record<string,unknown>|undefined;
 const candidates=[loc,geo,p];
 for(const x of candidates){
  const lat=x?.lat??x?.latitude,lon=x?.lon??x?.longitude;
  if(typeof lat==='number'&&typeof lon==='number'&&Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180)return {lat,lon};
 }
 return null;
}
export function safeUrl(v:unknown):string|null {if(typeof v!=='string')return null;try{const u=new URL(v);return u.protocol==='https:'||u.protocol==='http:'?u.href:null;}catch{return null;}}
