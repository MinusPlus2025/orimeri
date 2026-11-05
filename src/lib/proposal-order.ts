import type {Place} from './types';
const normalize=(value:string)=>value.normalize('NFKD').replace(/\p{M}/gu,'').trim().toLowerCase();
// Preserve Qloo order within each group. A secondary tag is not a primary use.
// This prioritizes category identity only; it does not establish quietness or availability.
export function prioritizeRequestedCategory(places:Place[],categories:string[]):Place[]{
 const requested=new Set(categories.map(normalize));
 if(!requested.size)return [...places];
 const primary:Place[]=[],secondary:Place[]=[];
 for(const place of places)(requested.has(normalize(place.category))?primary:secondary).push(place);
 return [...primary,...secondary];
}
