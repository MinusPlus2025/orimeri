import type {Place} from '@/lib/types';
const key=(value:string)=>value.normalize('NFKD').replace(/\p{M}/gu,'').trim().toLowerCase();
/** Explain secondary category matches without inferring venue suitability. */
export function CategoryContext({place,locale}:{place:Place;locale:'en'|'zh'|'ja'}){
 const categories=place.checks?.categories;
 if(!categories?.length||categories.some(category=>key(category)===key(place.category)))return null;
 const copy={
 en:{prefix:'Also tagged',detail:'Its main category is different from your search. That tag alone does not confirm it suits this visit.'},
 zh:{prefix:'同时标注为',detail:'它的主要类别与本次搜索不同，仅有这个标签还不能说明它适合这次需求。'},
 ja:{prefix:'追加のカテゴリー',detail:'主なカテゴリーは今回の検索と異なります。このタグだけでは、今回の目的に合うか判断できません。'}
 }[locale];
 return <span className="category-context"><span>{copy.prefix} {categories.join(' · ')}</span><span>{copy.detail}</span></span>;
}
