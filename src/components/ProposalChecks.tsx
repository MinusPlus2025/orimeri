import type {Place} from '@/lib/types';
/** Only server-confirmed checks. Legacy saved proposals have no checks and make no new claim. */
export function ProposalChecks({place,locale}:{place:Place;locale:'en'|'zh'|'ja'}){
 const checks=place.checks;if(!checks)return null;
 const text={en:{title:'What the available data confirms',category:'Listed category',distance:'Straight-line distance from',within:'within a limit of',excluded:'Not listed in its categories',limit:'These checks do not establish quietness, seating or current availability.'},zh:{title:'目前能确认什么',category:'已列出的类别',distance:'距搜索起点的直线距离',within:'范围上限',excluded:'地点分类中未标注',limit:'这些核对不能证明现场安静、有座位或当前可用。'},ja:{title:'データから確認できること',category:'登録カテゴリー',distance:'検索地点からの直線距離',within:'範囲の上限',excluded:'登録カテゴリーにないもの',limit:'静かさ、空席、現在の利用可否を保証するものではありません。'}}[locale];
 return <section className="proposal-checks" aria-label={text.title}><h3>{text.title}</h3><dl>{checks.categories.length>0&&<div><dt>{text.category}</dt><dd>{checks.categories.join(' · ')}</dd></div>}<div><dt>{text.distance} {checks.origin}</dt><dd>{(place.distanceM/1000).toFixed(2)} km <span>· {text.within} {checks.radiusM/1000} km</span></dd></div>{checks.excludedCategories.length>0&&<div><dt>{text.excluded}</dt><dd>{checks.excludedCategories.join(' · ')}</dd></div>}</dl><p>{text.limit}</p></section>;
}
