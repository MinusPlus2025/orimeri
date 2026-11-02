import type {Place} from '@/lib/types';
/** Only server-confirmed checks. Legacy saved proposals have no checks and make no new claim. */
export function ProposalChecks({place,locale}:{place:Place;locale:'en'|'zh'|'ja'}){
 const checks=place.checks;if(!checks)return null;
 const text={en:{title:'What this place meets',category:'Listed category',distance:'Distance from',excluded:'Excluded categories absent from returned tags',limit:'These checks do not establish quietness, seating or current availability.'},zh:{title:'这个地点已核对的条件',category:'已列出的类别',distance:'距离起点',excluded:'返回标签中未出现的排除类别',limit:'这些核对不能证明现场安静、有座位或当前可用。'},ja:{title:'この場所で確認できた条件',category:'登録カテゴリー',distance:'検索地点からの距離',excluded:'返却タグに含まれない除外カテゴリー',limit:'静かさ、空席、現在の利用可否を保証するものではありません。'}}[locale];
 return <section className="proposal-checks" aria-label={text.title}><h3>{text.title}</h3><dl>{checks.categories.length>0&&<div><dt>{text.category}</dt><dd>{checks.categories.join(' · ')}</dd></div>}<div><dt>{text.distance} {checks.origin}</dt><dd>{(place.distanceM/1000).toFixed(2)} / {checks.radiusM/1000} km</dd></div>{checks.excludedCategories.length>0&&<div><dt>{text.excluded}</dt><dd>{checks.excludedCategories.join(' · ')}</dd></div>}</dl><p>{text.limit}</p></section>;
}
