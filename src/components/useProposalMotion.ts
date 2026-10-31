'use client';
import {useCallback,useEffect,useRef} from 'react';
import {flushSync} from 'react-dom';
type Kind='culture-open'|'culture-close'|'replace'|'undo'|'select'|'arrive'|'question-open'|'question-close';
/** Presentation only: state commits once, synchronously; animations never own data. */
export function useProposalMotion(){
 const cleanup=useRef<(()=>void)[]>([]);
 const stop=useCallback(()=>{cleanup.current.splice(0).forEach(fn=>fn());},[]);
 useEffect(()=>{window.addEventListener('scroll',stop,true);window.addEventListener('resize',stop);return()=>{window.removeEventListener('scroll',stop,true);window.removeEventListener('resize',stop);stop();};},[stop]);
 return useCallback((kind:Kind,update:()=>void,cultureId?:string)=>{
  stop();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let root=document.querySelector('.shared-proposal');
  const oldHero=root?.querySelector<HTMLElement>('.place-photograph');
  const oldRect=oldHero?.getBoundingClientRect();const oldImage=oldHero?.querySelector('img')?.src;
  const cards=new Map<string,DOMRect>();root?.querySelectorAll<HTMLElement>('.proposal-index button').forEach(el=>{if(el.dataset.placeId)cards.set(el.dataset.placeId,el.getBoundingClientRect());});
  const dock=Array.from(root?.querySelectorAll<HTMLElement>('[data-culture-id]')??[]).find(el=>el.dataset.cultureId===cultureId);
  const origin=(kind==='culture-open'?dock?.querySelector('img'):root?.querySelector('.culture-focus-media img')) as HTMLImageElement|null;
  const originRect=origin?.getBoundingClientRect(),originSrc=origin?.src;
  flushSync(update);
  root=document.querySelector('.shared-proposal');
  if(reduced||!root){document.dispatchEvent(new CustomEvent('orimeri-motion',{detail:{kind,reduced:true,animations:0}}));return;}
  const animations:Animation[]=[];
  const animate=(el:Element,frames:Keyframe[],duration=320)=>{const a=el.animate(frames,{duration,easing:'cubic-bezier(.2,.8,.2,1)',fill:'none'});animations.push(a);cleanup.current.push(()=>a.cancel());return a;};
  const floatImage=(src:string,from:DOMRect,to:DOMRect,closing=false)=>{const img=document.createElement('img');img.src=src;img.alt='';img.setAttribute('aria-hidden','true');Object.assign(img.style,{position:'fixed',left:from.left+'px',top:from.top+'px',width:from.width+'px',height:from.height+'px',objectFit:'cover',pointerEvents:'none',zIndex:'1000',transformOrigin:'top left'});document.body.appendChild(img);const remove=()=>img.remove();cleanup.current.push(remove);const a=animate(img,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${to.left-from.left}px,${to.top-from.top}px) scale(${to.width/from.width},${to.height/from.height})`,opacity:closing?0.4:1}],360);a.finished.then(remove,remove);};
  if(kind==='arrive'){
   const hero=root.querySelector('.place-experience');if(hero)animate(hero,[{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0)'}],420);
  }else if(kind.startsWith('question')){
   const panel=root.querySelector('.contextual-question');if(panel)animate(panel,[{clipPath:'inset(0 0 100% 0)',transform:'translateY(-12px)'},{clipPath:'inset(0)',transform:'translateY(0)'}],300);
   const hero=root.querySelector('.place-photograph');if(hero&&oldRect){const rect=hero.getBoundingClientRect();if(rect.height)animate(hero,[{transform:`scaleY(${oldRect.height/rect.height})`,transformOrigin:'top'},{transform:'scaleY(1)',transformOrigin:'top'}],300);}
  }else if(kind.startsWith('culture')){
   const target=kind==='culture-open'?root.querySelector('.culture-focus-media img'):dock?.querySelector('img');
   if(originRect&&originSrc&&target){const rect=target.getBoundingClientRect();floatImage(originSrc,originRect,rect,kind==='culture-close');}
   const panel=root.querySelector('.culture-evidence-focus');if(panel)animate(panel,[{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}],360);
  }else{
   const hero=root.querySelector<HTMLElement>('.place-photograph');
   if(hero&&oldRect&&oldImage){const rect=hero.getBoundingClientRect();const ghost=document.createElement('img');ghost.src=oldImage;ghost.alt='';ghost.setAttribute('aria-hidden','true');Object.assign(ghost.style,{position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',objectFit:'cover',pointerEvents:'none',zIndex:'999'});document.body.appendChild(ghost);const remove=()=>ghost.remove();cleanup.current.push(remove);const direction=kind==='undo'?-1:1;const a=animate(ghost,[{transform:'translateX(0)',opacity:1},{transform:`translateX(${-direction*28}px)`,opacity:0}],300);a.finished.then(remove,remove);animate(hero,[{transform:`translateX(${direction*22}px)`,opacity:.45},{transform:'translateX(0)',opacity:1}],360);}
   root.querySelectorAll<HTMLElement>('.proposal-index button').forEach(el=>{const before=cards.get(el.dataset.placeId??'');const after=el.getBoundingClientRect();if(before){const x=before.left-after.left,y=before.top-after.top;if(Math.abs(x)+Math.abs(y)>1)animate(el,[{transform:`translate(${x}px,${y}px)`},{transform:'translate(0,0)'}]);}else animate(el,[{clipPath:kind==='undo'?'inset(0 0 0 100%)':'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],360);});
   const comparison=root.querySelector('.revision-comparison');if(comparison)animate(comparison,[{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0 0)'}]);
  }
  document.dispatchEvent(new CustomEvent('orimeri-motion',{detail:{kind,reduced:false,animations:animations.length}}));
 },[stop]);
}
