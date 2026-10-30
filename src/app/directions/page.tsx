'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,ArrowRight,ChevronLeft,ChevronRight,X,Check,MapPin,Info,Plus} from 'lucide-react';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/newsreader';
import {SourceImage} from '@/components/SourceImage';
import {DirectionIdentity} from '@/components/directions/Identity';
import type {Investigation,Taste} from '@/lib/types';
import './directions.css';
export default function Directions(){
 const[direction,setDirection]=useState<'a'|'b'>('a'),[result,setResult]=useState<Investigation|null>(null),[selected,setSelected]=useState(0),[focus,setFocus]=useState<'culture'|'facts'|'question'|'map'|null>(null),[object,setObject]=useState<Taste|null>(null),[draft,setDraft]=useState('这里真的安静吗？'),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{const d=new URLSearchParams(location.search).get('view');if(d==='b')setDirection('b');load();},[]);
 useEffect(()=>{if(focus)requestAnimationFrame(()=>document.querySelector('.object-focus')?.scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));},[focus]);
 async function load(){setLoading(true);setError('');try{const existing=sessionStorage.getItem('orimeri.direction-result');if(existing){const parsed=JSON.parse(existing);if(Date.now()-Date.parse(parsed.at)<300000){setResult(parsed);return;}}const response=await fetch('/api/design-preview');const body=await response.json();if(!response.ok||!body.ok)throw Error(body.code||'REQUEST_FAILED');setResult(body.result);sessionStorage.setItem('orimeri.direction-result',JSON.stringify(body.result));}catch(e){setError(e instanceof Error?e.message:'REQUEST_FAILED');}finally{setLoading(false);}}
 function switchDirection(d:'a'|'b'){setDirection(d);history.replaceState(null,'',`?view=${d}`);}
 function pick(index:number){setSelected(index);setFocus(null);}
 const place=result?.places[selected];
 const media=(src:string|null|undefined,name:string)=><SourceImage src={src} alt={name} fallback="影像不可用 · 实体原名"/>;
 const culture=(result?.taste??[]).map((item,i)=><button className={`cultural-object type-${item.type.split(':').at(-1)}`} key={item.entityId} onClick={()=>{setObject(item);setFocus('culture');}} aria-label={`查看 ${item.name}`}><div className="cultural-art">{media(item.image,item.name)}</div><span><strong>{item.name}</strong><small>{['音乐人','书籍','电影','设计人物','品牌'][i]} <Check size={11}/></small></span></button>);
 function evidence(kind:'facts'|'question'|'map'){setFocus(focus===kind?null:kind);}
 return <div className={`direction-page direction-${direction}`}>
  <div className="review-bar"><span>Gate 1 · 真实结果的视觉方向比较</span><nav aria-label="方向比较"><button aria-pressed={direction==='a'} onClick={()=>switchDirection('a')}>A 影像操作台</button><button aria-pressed={direction==='b'} onClick={()=>switchDirection('b')}>B 文化编辑页</button></nav><a href="/">现有应用<ArrowUpRight size={12}/></a></div>
  <header className="direction-header"><DirectionIdentity direction={direction}/><p>Same taste. Different moments.<span>品味如常，心境不同。</span></p><span className="direction-location"><MapPin size={14}/>东京 · 涩谷 <b>5 km</b></span></header>
  {loading?<main className="direction-loading"><h1>正在获取同一份真实提议。</h1><p>解析五个文化参照，调用 Qloo，复核涩谷 5km 边界。没有使用样例地点。</p></main>:error?<main className="direction-loading"><h1>查询未完成</h1><p>{error}</p><button onClick={load}>重试真实查询</button></main>:!place?<main className="direction-loading"><h1>没有符合边界的结果。</h1><p>没有放宽条件或填入虚构地点。</p></main>:<>
   <main className={`direction-workspace ${focus?'has-focus':''}`}>
    <section className="direction-intention"><span>此刻想要</span><p>安静读书，有一点生活气息。<em>今晚不去酒吧。</em></p><button onClick={()=>evidence('facts')} aria-label="查看本次请求">请求与筛选<ArrowUpRight size={15}/></button></section>
    <aside className="cultural-shelf"><h2>你的文化参照<span>{result!.taste.length} 个已确认</span></h2><div className="culture-sequence">{culture}</div></aside>
    <section className="proposal-space" aria-label="真实地点提议">
     <div className="proposal-topline"><span>与你的文化参照一起找到</span><div className="candidate-navigation"><button aria-label="上一个地点" onClick={()=>pick((selected+result!.places.length-1)%result!.places.length)}><ChevronLeft size={18}/></button><span>{selected+1} / {result!.places.length}</span><button aria-label="下一个地点" onClick={()=>pick((selected+1)%result!.places.length)}><ChevronRight size={18}/></button></div></div>
     <div className="proposal-composition">
      <div className="place-heading"><h1 key={place.id}>{place.name}</h1><p>{place.category}<span>{(place.distanceM/1000).toFixed(2)} km · 直线距离</span></p></div>
      <figure className="primary-visual" key={place.id}>{media(place.image,place.name)}<figcaption><span>Qloo 返回的场所影像</span>{place.image&&<a href={place.image} target="_blank" rel="noreferrer">来源<ArrowUpRight size={12}/></a>}</figcaption></figure>
      <div className="alternative-sequence" aria-label="切换候选">{result!.places.map((p,i)=>i===selected?null:<button key={p.id} className="alternative" onClick={()=>pick(i)} aria-label={`选中 ${p.name}`}><div>{media(p.image,p.name)}</div><span><strong>{p.name}</strong><small>{(p.distanceM/1000).toFixed(2)} km</small></span><ArrowUpRight size={16}/></button>)}</div>
      <div className="judgment-strip"><button onClick={()=>evidence('facts')} aria-expanded={focus==='facts'}><Check size={16}/><span>文化依据<small>Qloo 返回 · 可查看</small></span><ArrowUpRight size={15}/></button><button className="unverified-control" onClick={()=>evidence('question')} aria-expanded={focus==='question'}><Info size={16}/><span>适合安静阅读？<small>尚未核实 · 点此质疑</small></span><ArrowUpRight size={15}/></button><button onClick={()=>evidence('map')} aria-expanded={focus==='map'}><MapPin size={16}/><span>距离与位置<small>坐标复核 · 5 km 内</small></span><ArrowUpRight size={15}/></button></div>
     </div>
    </section>
    {focus&&<section className={`object-focus focus-${focus}`} aria-label="对象详情"><button className="close-focus" aria-label="关闭详情" onClick={()=>setFocus(null)}><X size={18}/></button>
     {focus==='culture'&&object&&<><div className="object-preview">{media(object.image,object.name)}</div><div><p className="focus-source">Qloo 已解析的实体</p><h2>{object.name}</h2><code>{object.entityId}</code><p>它参与了本次推荐。不能将一个输入贡献解释为你一定喜欢这个地点。</p>{object.image&&<a href={object.image} target="_blank" rel="noreferrer">查看影像来源<ArrowUpRight size={13}/></a>}</div></>}
     {focus==='facts'&&<><div><p className="focus-source">Qloo 事实与 Agent 理解</p><h2>这条提议依据什么？</h2><p>{place.evidence.find(e=>e.label==='Listed categories')?.detail}</p><p>{place.interpretation}</p><small>上方英文为当前真实响应的原文。</small></div><div><p>{result!.taste.map(t=>t.name).join(' / ')}</p><details open><summary>查看 Qloo 贡献记录</summary>{place.evidence.filter(e=>result!.taste.some(t=>t.name===e.label)).map(e=><p key={e.label}><strong>{e.label}</strong> {e.detail}</p>)}</details><code>{place.id}</code></div></>}
     {focus==='question'&&<><div><p className="focus-source">正在质疑 · {place.name}</p><h2>“适合安静阅读”还不是事实。</h2><p>已知：Qloo 类别与实际坐标。未知：此刻噪声、人流、座位和阅读环境。影像不能证明这些条件。</p></div><div><label htmlFor="direction-question">你想核实什么？</label><textarea id="direction-question" value={draft} onChange={e=>setDraft(e.target.value)} rows={2}/><button className="future-action" disabled>重新调查 · Gate 2 接入<ArrowRight size={15}/></button><small>本轮只比较界面；草稿未发送，也未修改偏好。</small></div></>}
     {focus==='map'&&<><div className="coordinate-view"><svg viewBox="0 0 260 200" role="img" aria-label="真实坐标与五公里范围"><circle cx="130" cy="100" r="82"/><path d="M130 14v172M44 100h172"/><text x="133" y="12">N</text><text x="136" y="113">涩谷</text>{result!.places.map((p,i)=>{const x=130+(p.lon-result!.area.lon)*Math.cos(result!.area.lat*Math.PI/180)*111320/5000*82,y=100-(p.lat-result!.area.lat)*111320/5000*82;return <g key={p.id} onClick={()=>setSelected(i)} role="button" tabIndex={0} aria-label={`定位 ${p.name}`} onKeyDown={e=>{if(e.key==='Enter')setSelected(i);}}><circle className={i===selected?'selected-coordinate':''} cx={x} cy={y} r="10"/><text x={x} y={y+3} textAnchor="middle">{i+1}</text></g>;})}</svg></div><div><h2>位置来自实际坐标。</h2><p>{place.address}</p><p>{place.lat.toFixed(5)}, {place.lon.toFixed(5)} · {(place.distanceM/1000).toFixed(2)} km</p><small>局部坐标投影；圆为 5km 范围。没有绘制道路或推测路线。</small><a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`} target="_blank" rel="noreferrer">在地图中打开<ArrowUpRight size={14}/></a></div></>}
    </section>}
   </main>
   <footer className="direction-footer"><span>真实 Qloo 查询 · {new Date(result!.at).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false})}</span><span>可点击：文化对象 / 候选 / 证据 · Gate 1 尚待选择</span></footer>
  </>}
 </div>;
}
